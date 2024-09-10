import React from 'react';
import { MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';
 
export default function App() {
  return (
    <MDBCarousel interval={1500}  showControls fade className='h-550'>
    <MDBCarouselItem itemId={1}>
      <img src='/images/1.png' className='w-100 ' />
      <MDBCarouselCaption>
        <h5>First slide label</h5>
        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
      </MDBCarouselCaption>
    </MDBCarouselItem>

    <MDBCarouselItem itemId={2}>
      <img src='/images/2.png' className='d-block w-100' alt='...' />
      <MDBCarouselCaption>
        <h5>Second slide label</h5>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </MDBCarouselCaption>
    </MDBCarouselItem>

    <MDBCarouselItem itemId={3}>
      <img src='/images/3.png' className='d-block w-100' alt='...' />
      <MDBCarouselCaption>
        <h5>Third slide label</h5>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
      </MDBCarouselCaption>
    </MDBCarouselItem>
  </MDBCarousel>
  );
}