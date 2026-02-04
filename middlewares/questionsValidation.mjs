const questionsValidation = (req, res, next) => {
    const { title, description, category } = req.body;
  
    const trimmedTitle = title?.trim();
    const trimmedDescription = description?.trim();
    const trimmedCategory = category?.trim();
  
    if (!trimmedTitle || !trimmedDescription || !trimmedCategory) {
      return res.status(400).json({
        message: "Invalid request data.",
      });
    }
  
    req.body.title = trimmedTitle;
    req.body.description = trimmedDescription;
    req.body.category = trimmedCategory;
  
    next();
  };
  
  export default questionsValidation;
  