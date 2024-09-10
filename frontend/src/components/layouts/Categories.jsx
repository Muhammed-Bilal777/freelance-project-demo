import React from 'react'
import { MDBBtn } from 'mdb-react-ui-kit';
const Categories = () => {
  return (
    <div className='py-3 d-flex justify-content-around'>
    <MDBBtn className='me-1' color='success'>
    Electronics
      </MDBBtn>
      <MDBBtn className='me-1' color='danger'>
      Cameras
      </MDBBtn>
      <MDBBtn className='me-1' color='warning'>
      Laptops
      </MDBBtn>
      <MDBBtn color='info'>
      Accessories
      </MDBBtn>
      <MDBBtn className='me-1' color='success'>
      Headphones
      </MDBBtn>
      <MDBBtn className='me-1' color='danger'>
      Food
      </MDBBtn>
      <MDBBtn className='me-1' color='warning'>
      Books
      </MDBBtn>
      <MDBBtn color='info'>
      Sports
      </MDBBtn>
    </div>
  )
}

export default Categories
