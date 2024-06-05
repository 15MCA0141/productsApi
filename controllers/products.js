const Product = require("../models/product");

const getAllProducts = async (req, res) => {
//Search functionality
    const { company, name, featured, sort, select } = req.query;
    const queryObj = {};

    if (company) {
        queryObj.company = company;
    }
    if (name) {
        queryObj.name = {$regex: name, $options: "i"}; //here regex used for considering the spell mismatch instead of exact keyword. 
    }
    if (featured) {
        queryObj.featured = featured;
    }
    //End of search functionality
    
    //Sort functionality
    let apiData = Product.find(queryObj);
    if (sort) {
        const sortString = sort.split(",").join(" ");
        apiData = Product.find(queryObj).sort(sortString);
    }
    //End of sort functionality
    
    //Select functionality
    if (select) {
        const selectString = select.split(",").join(" ");
        apiData = Product.find(queryObj).select(selectString);
    }
    //End of select functionality

    //Pagination functionality
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;
    let skip = (page - 1) * limit;
    apiData = apiData.skip(skip).limit(limit);
    //End of pagination functionality

    console.log(queryObj);
    const Products = await apiData;
    res.status(200).json({Products, nbHits: Products.length});
}

const getAllProductsTesting = async (req, res) => {
    const Products = await Product.find(req.query).select("name"); 
    console.log(req.query);
    res.status(200).json(Products);
}

module.exports = { getAllProducts, getAllProductsTesting };