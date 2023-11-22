const Campground = require('../models/campgrounds')
const { cloudinary} = require('../cloudinary/index')
module.exports.allCampgrounds = async (req, res) => {
    const camps = await Campground.find({});
    res.render('campground/index', { camps });
}

module.exports.renderNewForm =  (req, res) => {
    res.render('campground/new')
}

module.exports.createForm = async (req, res, next) => {
    //if(!(req.body,itle && req.body.price && req.body.image && req.body.location && req.body.description)){ 
   let  campground = new Campground(req.body);
   campground.author = req.user._id;
   campground.image = req.files.map((img) => ({ url : img.path, name : img.filename}))
   await campground.save()
   req.flash('success', "Succesfully Created New Campground")
   res.redirect(`/campgrounds/${campground._id}`)
 }

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
    if(!camp){
     req.flash('error', "Campground Not Found")
     return res.redirect('/campgrounds')
    }
    res.render('campground/edit', {camp})
  }
module.exports.showCampgrounds = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
      path: "reviews",
      populate :{
       path: "author"
      }
    }).populate("author");
    if(!camp){
     req.flash('error', "Campground Not Found")
     return res.redirect('/campgrounds')
    }
    res.render('campground/show', { camp})
  }
module.exports.editCampgrounds = async (req, res) =>{
    const { id } = req.params;
   const camp = await Campground.findByIdAndUpdate( id, req.body);
   const newImages = req.files.map((img) => ({ url : img.path, name : img.filename}))
   camp.image.push(...newImages)
   if(req.body.deletedImages){
    for(let img of req.body.deletedImages){
       await cloudinary.uploader.destroy(img)
    }
    await camp.updateOne({ $pull: {image : {name :{ $in: req.body.deletedImages } } } })
   }
   console.log(camp)
   await camp.save()
    req.flash('success', "Succesfully Edited  Campground")
    res.redirect(`/campgrounds/${camp.id}`)
  }

module.exports.destroyCampgrounds = async (req, res) => {
    const { id } = req.params;
    const deleteCamp = await Campground.findByIdAndDelete(id);
    req.flash('success', "Succesfully Deleted Campground")
    res.redirect('/campgrounds')
  }