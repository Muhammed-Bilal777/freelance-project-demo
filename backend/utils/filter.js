class APIFilters{
    constructor(query,queryString){
        this.query = query;
        this.queryString=queryString;
    }

    search(){
        const keyword = this.queryString.keyword ? {
            name :{
                $regex :this.queryString.keyword,
                $options:"i",
            }
        }:{}

        this.query = this.query.find({...keyword})
        return this 
    }

    filters() {
         let querCopy = {...this.queryString}
          
         const filedsToRemove = ['keyword','page'];

         filedsToRemove.forEach((ele)=> delete querCopy[ele]);
        let queryStr = JSON.stringify(querCopy);
      
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g ,(match)=>`$${match}`)
        this.query=this.query.find(JSON.parse(queryStr))
         return this
      }

      pagination(resPerPage){
        let currentPage = Number(this.queryString.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip)
        return this;
      }
    }

export default APIFilters;