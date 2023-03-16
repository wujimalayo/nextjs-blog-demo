import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import dynamic from "next/dynamic";
import ErrorPage from "next/error";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import remarkGfm from "remark-gfm";
import {
  Container,
  Box,
  Heading,
  Text,
  Link,
  Image,
  Center,
} from "@chakra-ui/react";
// import { NextSeo } from "next-seo/lib/meta/nextSEO";

const PostPage = dynamic(() => import("components/PostPage"));

type Props = {
  title: any;
  date: any;
  originalUrl: any;
  mdxSource: any;
  cover: any;
};

const Post = ({
  title,
  date,
  originalUrl,
  mdxSource,
  cover,
}: Props) => {
  const router = useRouter();
  if (!router.isFallback && !mdxSource) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Container
      mt={20}
      maxW={{
        sm: "container.sm",
        md: "container.md",
        lg: "container.2xl",
        xl: "container.xl",
      }}
      className="post"
    >
      {/* <NextSeo
        title={title}
        description={description}
        openGraph={{ title, description }}
      /> */}
      <Box as="hgroup">
        <Text textAlign="center" color="gray.500" fontSize="xs" as="p">
          Published {date}
        </Text>
        <Heading textAlign="center" as="h1" mt={4} mb={2}>
          {title}
        </Heading>
        {originalUrl && (
          <Center color="gray.500" fontSize="sm" mb={8}>
            本文翻译自：
            <NextLink legacyBehavior href={originalUrl} passHref>
              <Link>{originalUrl}</Link>
            </NextLink>
          </Center>
        )}
      </Box>
      <Image
        boxSize="100%"
        src={
          cover ??
          "https://cdn.jsdelivr.net/gh/manonicu/pics@master/uPic/NhSU3O.jpg"
        }
        alt={title}
      />

      <PostPage>
        <MDXRemote {...mdxSource} />
      </PostPage>
    </Container>
  );
};

export const getStaticPaths = async () => {
  const { GetAllPosts } = await import("utils/getAllPosts");
  const allPosts = await GetAllPosts();
  const paths = allPosts.map((post: { slug: any }) => ({
    params: {
      slug: post.slug.split("/"),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

type StaticProps = {
  params: any;
};

export const getStaticProps = async ({ params }: StaticProps) => {
  const { GetPostBySlug } = await import("utils/getAllPosts");
  const { content, ...data } = await GetPostBySlug(params.slug);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [[remarkGfm]],
      rehypePlugins: [],
    },
    scope: data,
  });
  return {
    props: {
      ...data,
      mdxSource,
    },
  };
};

export default Post;
