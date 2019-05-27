import dimensions from "../src/dimensions";

class Assessment {
  constructor() {
    this.questions = [];
    this.populateQuestions();
    this.results = {
      Adaptive: 0,
      Integrity: 0,
      Collaborative: 0,
      Result: 0,
      Customer: 0,
      Detail: 0
    };
  }

  async populateQuestions() {
    this.questions = await this.getAssessmentQuestions();
  }

  async getAssessmentQuestions() {
    let questions = [];
    let fourDistinctRandomNumbers = await this.getFourDistinctRandomNumbers();

    for (let i = 0; i < dimensions.length; i++) {
      for (let j = i + 1; j < dimensions.length; j++) {
        let question = {};
        question.combination = [dimensions[i].name, dimensions[j].name];
        question.options = [
          dimensions[i].answers[fourDistinctRandomNumbers[0]],
          dimensions[j].answers[fourDistinctRandomNumbers[1]]
        ];
        questions.push(question);

        let anotherQuestion = {};
        anotherQuestion.combination = [dimensions[i].name, dimensions[j].name];
        anotherQuestion.options = [
          dimensions[i].answers[fourDistinctRandomNumbers[2]],
          dimensions[j].answers[fourDistinctRandomNumbers[3]]
        ];
        questions.push(anotherQuestion);
      }
    }

    return questions;
  }

  async getFourDistinctRandomNumbers() {
    let fourDistinct = [];

    while (fourDistinct.length < 4) {
      let random = Math.floor(Math.random() * Math.floor(10));
      if (fourDistinct.indexOf(random) === -1) {
        fourDistinct.push(random);
      }
    }
    return fourDistinct;
  }

  async chooseAnswer(dimension) {
    this.results[dimension]++;
  }

  async getTestResults() {
    return this.results;
  }
}

export default Assessment;
