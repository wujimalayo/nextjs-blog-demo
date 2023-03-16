import fs from "fs";
import { globby } from "globby";
import matter from "gray-matter";
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

//获取所有文章
const GetAllPosts = async () => {
  const posts = await globby(["_posts"]);
  return posts
    .reduce((prev, next) => {
      const fileContents = fs.readFileSync(next, "utf8");
      const { data, content } = matter(fileContents);
      const postData = {
        ...data,
        group: dayjs(data.date).format("MMM/YYYY"),
        date: dayjs(data.date).format("MMM DD, YYYY"),
        fromNow: dayjs(data.date).fromNow(),
        modified: dayjs(data.modified).format("MMM DD, YYYY"),
        content,
        slug: next.replace(/^_posts\//, "").replace(/\.mdx$/, ""),
      };
      !data.draft && prev.push(postData);
      return prev;
    }, [])
    .sort((a, b) => dayjs(b.date) - dayjs(a.date));
};

// 根据slug导出文章
const GetPostBySlug = (slug) => {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    GetAllPosts()
      .then((posts) => {
        const post = posts.find((post) =>
          post.slug.includes(`${slug.join("/")}`)
        );
        resolve(post);
      })
      .catch(() => {
        reject({});
      });
  });
};

export { GetAllPosts, GetPostBySlug };
