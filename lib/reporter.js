"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("colors");
const reporters_1 = require("@jest/reporters");
class TutormeReporter extends reporters_1.DefaultReporter {
    async onTestCaseResult(test, testCaseResult) {
        const color = testCaseResult.status === "passed"
            ? colors_1.green
            : testCaseResult.status === "skipped"
                ? colors_1.gray
                : testCaseResult.status === "failed"
                    ? colors_1.red
                    : colors_1.white;
        process.stderr.write(`=== ${color(testCaseResult.status)}\n`);
        return super.onTestCaseResult(test, testCaseResult);
    }
}
exports.default = TutormeReporter;
