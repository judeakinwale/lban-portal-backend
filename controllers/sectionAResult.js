const SectionAResult = require("../models/SectionAResult");
const Initiative = require("../models/Initiative");
const current = require("../utils/currentAppraisalDetails");
const resultScore = require("../utils/calculateScore");
const { calculateScore } = require("../utils/calculateScore")
const { ErrorResponseJSON } = require("../utils/errorResponse");

// Create an sectionAResult
const createSectionAResult = async (req, res) => {
  const { currentSession, currentQuarter } = await current();

  try {
    let { user, body } = req;
    const { session, quarter } = body;

    const existingResult = await SectionAResult.findOne({
      user: req.user,
      session: currentSession,
      quarter: currentQuarter,
    });

    // // const score = await resultScore.ResultScore(req);

    // // if req.params.id exists, get staff using req.params.id, else, use req.user
    // // calculate manager score
    // let score;
    // if (req.params.id) {
    //   console.log("req.params found")
    //   console.log("score calculated")
    //   score = await resultScore.ResultScoreUpdate(req, "score");
    // } else {
    //   console.log("req.params not found")
    //   console.log("score calculated")
    //   // score = await resultScore.ResultScore(req);
    //   score = await calculateScore(req)
    // }    

    let score = await calculateScore(req)

    if (!session || !quarter) {
      body.session = currentSession;
      body.quarter = currentQuarter;
    }
    body.user = user;
    body.score = Number(score?.sectionAScore?.toFixed(2) ?? 0);

    try {
      // // const managerScore = await resultScore.ResultScoreUpdate(
      // //   req,
      // //   (scoreType = "managerscore")
      // // );

      // // if req.params.id exists, get staff using req.params.id, else, use req.user
      // // calculate manager score
      // let managerScore;
      // if (req.params.id) {
      //   console.log("req.params found")
      // console.log("manager score calculated")
      //   managerScore = await resultScore.ResultScoreUpdate(
      //     req,
      //     (scoreType = "managerscore")
      //   );
      // } else {
      //   console.log("req.params not found")
      // console.log("manager score calculated")
      //   managerScore = await resultScore.ResultScore(
      //     req,
      //     (scoreType = "managerscore")
      //   );
      // }

      let managerScore = await calculateScore(req, "managerscore")

      body.managerscore = Number(managerScore?.sectionAScore?.toFixed(2) ?? 0);
    } catch (err) {
      console.log(err.message);
    }

    let result;

    if (existingResult) {
      result = await SectionAResult.findByIdAndUpdate(existingResult.id, body, {
        new: true,
        runValidators: true,
      });
    } else if (body.score < 1) {
      return new ErrorResponseJSON(
        res,
        "Section A has not been completed!",
        400
      );
    } else {
      result = await SectionAResult.create(body);
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get sectionAResult
const getSectionAResult = async (req, res) => {
  try {
    const { currentSession, currentQuarter } = await current();

    const result = await SectionAResult.findOne({
      user: req.user,
      session: currentSession,
      quarter: currentQuarter,
    });
    if (!result) {
      return new ErrorResponseJSON(
        res,
        "Section A has not been completed!",
        404
      );
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(err.message);
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

module.exports = {
  createSectionAResult,
  getSectionAResult,
};
