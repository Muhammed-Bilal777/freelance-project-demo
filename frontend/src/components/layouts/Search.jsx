import React, { useState } from 'react'
import { BiSearchAlt } from "react-icons/bi";
import {useNavigate} from "react-router-dom"
const Search = () => {
   
    const navigate = useNavigate()

    const [keyword,setKeyword] = useState("")

    const handleSubmit =(e)=>{
        e.preventDefault();
        if(keyword.trim()){
            navigate(`?keyword=${keyword}`)
            setKeyword('')
        }else{
             navigate('/')
             setKeyword('')
        }
    }
  return (
    <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="search_field"
              aria-describedby="search_btn"
              className="form-control"
              placeholder="Enter Product Name ..."
              name="keyword"
              value={keyword}
              onChange={(e)=>setKeyword(e.target.value)}
              
            />
            <button id="search_btn" className="btn" type="submit">
          <i ><BiSearchAlt size={20} color="#000"/></i>
        </button>
          </div>
        </form>
  )
}

export default Search
