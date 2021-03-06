// The value of data should be the JSON object generated at: <repository root>/deploy/src/mrkl_build/mrklData.json
const data: {
  [key: string]: {
    tokens: string;
    proof: string[];
    leafDataPacked: string;
  };
} = {
  tz1ZczbHu1iLWRa88n9CUiCKDGex5ticp19S: {
    tokens: "100",
    proof: [
      "6fd53a9cbed7131f073ffb7c5e98bbb862ec36ea760b66067656f6091949e4f2",
      "2800b79312399df0116736073b3c468fb4ebd3c791624bdcc1db2d3cbe5ffc58",
    ],
    leafDataPacked: "0507070a000000160000995f977510b3e59e34b4b0b4adb6552cedc5ff5c00a401",
  },
  tz1eUzpKnk5gKLYw4HWs2sWsynfbT7ypGxNM: {
    tokens: "200",
    proof: [
      "4ef76d73abb14194755febcf8830493a021ef08c5477823e409ecb1aac86de79",
      "2800b79312399df0116736073b3c468fb4ebd3c791624bdcc1db2d3cbe5ffc58",
    ],
    leafDataPacked: "0507070a000000160000ceb51496bb5cbe2eb35be357e0f34b89682a8f91008803",
  },
  tz1fxRWk1b53H3RLVxuipjCJJghPmzju7zQA: {
    tokens: "300",
    proof: [
      "8630b4452805c75bdab9da5d09dc1cfd4fcbd971e397af31fab3ee7421ae745a",
      "555a4df967eca2f3e44cb4930abd5ca5202d0b76a822bd30cbaea05dbec40d02",
    ],
    leafDataPacked: "0507070a000000160000dedd0d963d5e30a9d738771ae98ffe7ca5e052a000ac04",
  },
  tz1VyBpzPZSpYHpqKzvVHWGs8vSuoiBHmZSN: {
    tokens: "400",
    proof: [
      "803d9cd47ab3a3997d8a4fee2f2fc0bcc032fb57211490cbb2cb90c44c5c2db2",
      "555a4df967eca2f3e44cb4930abd5ca5202d0b76a822bd30cbaea05dbec40d02",
    ],
    leafDataPacked: "0507070a0000001600007150c9870f93c680ee84473d86e3028b9aedf9db009006",
  },
};

export default data;
