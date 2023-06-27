import { red, green, gray, white } from "colors";
import { TestCaseResult } from "@jest/test-result";
import { Test, DefaultReporter } from "@jest/reporters";

export default class TutormeReporter extends DefaultReporter {
  async onTestCaseResult(test: Test, testCaseResult: TestCaseResult) {
    const color =
      testCaseResult.status === "passed"
        ? green
        : testCaseResult.status === "skipped"
        ? gray
        : testCaseResult.status === "failed"
        ? red
        : white;
    process.stderr.write(`=== ${color(testCaseResult.status)}\n`);
    return super.onTestCaseResult(test, testCaseResult);
  }
}
