import Assessment from "../src/assessment";
import Dimensions from "../src/dimensions";

import * as _ from "underscore";

describe("The Assessment", () => {
  let assessment, questions;
  beforeEach(async () => {
    assessment = new Assessment();
    await assessment.populateQuestions();
    questions = assessment.questions;
  });

  it("should have 30 questions", async () => {
    expect(assessment.questions).toHaveLength(30);
  });

  it("should not show the same answer twice", async () => {
    for (let i = 0; i < questions.length; i++) {
      for (let j = 0; j < questions.length; j++) {
        if (i !== j) {
          expect(
            _.difference(questions[i].options, questions[j].options).length
          ).not.toBe(0);
        }
      }
    }
  });

  it("should match each dimension to the other dimensions exactly 2 times", async () => {
    for (let i = 0; i < questions.length; i++) {
      let count = 1;
      for (let j = 0; j < questions.length; j++) {
        if (
          _.difference(questions[i].combination, questions[j].combination)
            .length === 0 &&
          i !== j
        ) {
          count++;
        }
      }
      expect(count).toBe(2);
    }
  });

  it("should provide ipsative questions (two possible answers)", async () => {
    for (let question of questions) {
      expect(question.options).toHaveLength(2);
    }
  });

  describe("when completed", async () => {
    it("should provide the results as an object", async () => {
      assessment.chooseAnswer("Adaptive");
      assessment.chooseAnswer("Adaptive");
      assessment.chooseAnswer("Adaptive");
      assessment.chooseAnswer("Adaptive");

      assessment.chooseAnswer("Integrity");
      assessment.chooseAnswer("Integrity");
      assessment.chooseAnswer("Integrity");
      assessment.chooseAnswer("Integrity");

      assessment.chooseAnswer("Customer");
      assessment.chooseAnswer("Customer");
      assessment.chooseAnswer("Customer");

      assessment.chooseAnswer("Detail");

      assessment.chooseAnswer("Result");

      assessment.chooseAnswer("Collaborative");

      const results = await assessment.getTestResults();

      expect(results).toBeInstanceOf(Object);
      expect(results["Adaptive"]).toBe(4);
      expect(results["Integrity"]).toBe(4);
      expect(results["Customer"]).toBe(3);
      expect(results["Detail"]).toBe(1);
      expect(results["Result"]).toBe(1);
      expect(results["Collaborative"]).toBe(1);
    });

    it("should represent the results based on 6 dimensions", async () => {
      const results = await assessment.getTestResults();
      const dimensions = Object.keys(results);

      expect(dimensions).toHaveLength(6);
      expect(dimensions).toContain("Adaptive");
      expect(dimensions).toContain("Integrity");
      expect(dimensions).toContain("Result");
      expect(dimensions).toContain("Collaborative");
      expect(dimensions).toContain("Detail");
      expect(dimensions).toContain("Customer");
    });
  });
});
