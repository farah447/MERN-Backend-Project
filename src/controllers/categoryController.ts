import slugify from 'slugify';

import { NextFunction, Request, Response } from "express";
import { Category } from "../models/categorySchema";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find();
    res.send({ message: "get all Categories", payload: categories });
  } catch (error) {
    next(error);
  }
};


export const createCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { title } = req.body;
     
     const CategoryExist = await Category.exists({title:title})
     if(CategoryExist){
      throw new Error("Category already exists")
     }
      const newCategory = new Category({
        title: title,
        slug: slugify(title),
      });
  
      await newCategory.save()
      res.status(201).send({ message: "the Category is created" });
    } catch (error) {
      next(error);
    }
  };
  

  export const getCategoryBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = await Category.find({slug:req.params.slug});
      if(category.length === 0){
        throw new Error("Category not found")
      }
      
      res.send({ message: "get one Category", payload: category });
    } catch (error) {
      next(error);
    }
  };



  export const deleteCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = await Category.findOneAndDelete({slug:req.params.slug});
      if(!category){
        throw new Error('Category is not found')

      }
      res.send({ message: "delete category", payload: category });

    } catch (error) {
      next(error);
    }
  };


  export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
if(req.body.title){
req.body.slug= slugify(req.body.title)

}

      const category = await Category.findOneAndUpdate({slug:req.params.slug}, req.body,{new: true});
     
  
      if(!category){
        throw new Error('Category is not found')

      }
      res.send({ message: "update single Category", payload: category });

    } catch (error) {
      next(error);
    }
  };