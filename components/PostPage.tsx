import React, { useEffect, FC } from "react";
import Prism from "prismjs";
import { Box } from "@chakra-ui/react";

// 以下按需引入
require("prismjs/components/prism-go");
require("prismjs/components/prism-python");
require("prismjs/components/prism-javascript");
require("prismjs/components/prism-css");
require("prismjs/components/prism-bash");
require("prismjs/components/prism-swift");
require("prismjs/components/prism-tsx");
require("prismjs/components/prism-jsx");
require("prismjs/components/prism-typescript");
require("prismjs/components/prism-sql");
require("prismjs/themes/prism-okaidia.min.css");

type Props = {
  children: React.ReactNode;
};

const PostPage: FC<Props> = ({ children }) => {
  useEffect(() => {
    const highlight = async () => {
      await Prism.highlightAll();
    };
    highlight().then(() => {});
  }, [children]);
  return (
    <Box position="relative" w="2/3" fontSize="text.sm">
      {children}
    </Box>
  );
};
export default PostPage;
