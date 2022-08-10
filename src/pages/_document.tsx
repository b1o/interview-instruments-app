import * as React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html >
        <Head></Head>
        <body className="bg-slate-300 text-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
