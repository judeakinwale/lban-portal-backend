const AppraisalA = require("../models/AppraisalA")
const {ErrorResponseJSON} = require("../utils/errorResponse")

// Create an appraisalA
const createAppraisalA = async (req, res) => {
  try {
    const appraisal = await AppraisalA.create(req.body);

    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get all appraisalAs
const getAllAppraisalA = async (req, res) => {
  try {
    const appraisalA = await AppraisalA.find({});
    if (!appraisalA) {
      return new ErrorResponseJSON(res, "AppraisalAs not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: appraisalA,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get appraisalA by ID
const getAppraisalA = async (req, res) => {
  try {
    const appraisalA = await AppraisalA.findById(req.params.id);
    if (!appraisalA) {
      return new ErrorResponseJSON(res, "AppraisalA not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: appraisalA,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Upadate an appraisalA's details using ID
const updateAppraisalA = async (req, res) => {
  try {
    const appraisalA = await AppraisalA.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: appraisalA,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Delete an appraisalA using ID
const deleteAppraisalA = async (req, res) => {
  try {
    const appraisalA = await AppraisalA.findByIdAndDelete(req.params.id);
    if (!appraisalA) {
      return new ErrorResponseJSON(res, "AppraisalA not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: appraisalA,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

module.exports = {
  createAppraisalA,
  getAllAppraisalA,
  getAppraisalA,
  updateAppraisalA,
  deleteAppraisalA
}