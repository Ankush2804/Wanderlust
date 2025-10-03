const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

//index and create route
// router.route("/")
// .get(wrapAsync(listingController.index))
// .post(isLoggedIn,validateListing,upload.single("listing[image]"),
//     wrapAsync(listingController.createListing))
// .post((req,res)=>{
//     res.send(req.file);
// })

router.route("/")
  // GET all listings (with optional category filter)
  .get(wrapAsync(listingController.index))

  // POST new listing with image upload
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

// If you want to debug the uploaded file separately:
router.post("/debug-upload", upload.single("listing[image]"), (req, res) => {
  res.send(req.file);
});


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);


//search route
router.get("/search",listingController.searchListing);

//show,update & delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,
    wrapAsync(listingController.destroyListing));



//edit route
router.get("/:id/edit",isLoggedIn,isOwner,
    wrapAsync(listingController.renderEditForm));


module.exports=router;