import { Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useIpfs } from "../contexts/ipfsContext";

export default function Home() {
  const [pageContent, setPageContent] = useState<string>("");
  const ipfs = useIpfs();

  useEffect(() => {
    async function init() {      
      console.log("trying fetch from ipfs");
      const content = Buffer.of();
      const bb = ipfs.api?.cat('QmT1fzcAEhy8YUJWyohPA3miUo3v4mPjiPqh1q6Ri19rgX');
      for await (const chunk of bb!) {
        content.write(new TextDecoder("utf-8").decode(chunk));
      }
      console.log(`ipfs cat result: ${content.toString()}`);
      setPageContent(content.toString());
    }

    if ((!pageContent || pageContent === "") && ipfs.ready ) {
      init();
    }
  }, [pageContent, ipfs.ready, ipfs.api])

  return (
    <>
      <Heading>Risk scoring for all</Heading>
      <pre>
        {pageContent}
      </pre>
    </>
  )
}