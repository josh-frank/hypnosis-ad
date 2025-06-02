import './App.css'
import './Spiral.css'
// import { useEffect, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';

const App = () => {

  // const [ timer, setTimer ] = useState( 0 );

  // useEffect( () => {
  //   const interval = setInterval( () => setTimer( timer + 1 ), 1000 );
  //   return () => clearInterval( interval );
  // }, [ timer ] );

  const boundingBox = new Rectangle(
    -window.innerHeight / 2,
    -window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerWidth / 2,
  );

  // const spirals = [
  //   new Spiral( 1, 1.05, boundingBox, 20 ),
  //   new Spiral( 1.15, 1.05, boundingBox, 20 ),
  // ];
  const spirals = [
    new Spiral( 1.5, 1.1, boundingBox, 20 ),
    new Spiral( 1.9, 1.1, boundingBox, 20 ),
  ];

  return <>

    <svg
      id="spiral-svg"
      width="100%"
      height="100%"
      viewBox={ [
        boundingBox.width() / -2,
        boundingBox.height() / -2,
        boundingBox.width(),
        boundingBox.height(),
      ].join( ' ' ) }
      preserveAspectRatio="xMidYMid slice"
      zoomAndPan="disable"
      contentScriptType="text/ecmascript"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path id='spiral' d={ spirals[0].d + spirals[1].reverseD + 'Z' } />
      <clipPath id='myClip'><AdText /></clipPath>
      <AdText />
      <use clipPath='url(#myClip)' href='#spiral' fill='white' />
    </svg>

    <QRCodeSVG
      value='https://quitsmokingwithhypnosis.com/'
      size={ 200 }
      marginSize={ 4 }
      level='H'
      style={ {
        zIndex: 10,
        position: 'absolute',
        bottom: 10,
        right: 10,
        borderRadius: 10
      } }
    />

    <marquee
      scrollamount={ 16 }
      style={ {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 5,
        padding: 5,
        // fontSize: 9,
        lineHeight: 1.3,
        letterSpacing: 1.05, // letterSpacing: -0.75,
        fontWeight: 'bold',
        textTransform: 'uppercase',
      } }
    >
      { Array( 10 ).fill( [
        'US clients only',
        'See website for important details and terms/conditions',
        `©${ new Date().getFullYear() } QuitSmokingWithHypnosis.com`,
        'You\'re already feeling very relaxed!'
      ] ).flat().map(
        ( element, index ) => <span key={ index }>{ element }</span>
      ) }
    </marquee>

    {/* <marquee scrollAmount={ 10 }>
      <h1>✆ Text (833) 78-HYPNO for a FREE consultation</h1>
      <small>By messaging, you consent to chatting with a live hypnotist. Message and data rates may apply. Reply STOP to opt out or HELP for more info at any time.</small>
    </marquee> */}

    {/* <div id="timer">
      { timer > 3600 ? `${ Math.floor( timer / 3600 ).toString().padStart( 2, '0' ) }:` : '' }
      { Math.floor( ( timer % 3600 ) / 60 ).toString().padStart( 2, '0' ) }
      :
      { ( timer % 60 ).toString().padStart( 2, '0') }
    </div> */}

  </>

}

export default App

const AdText = () => <>
  <text textAnchor="middle" dx='0' dy='-265'>Quit</text>
  <text textAnchor="middle" dx='0' dy='-125'>Smoking</text>
  <text textAnchor="middle" dx='0' dy='15'>with</text>
  <text textAnchor="middle" dx='0' dy='140'>Hypnosis</text>
  <text textAnchor="middle" dx='0' dy='275'>.com</text>
</>;

///////////////////////
///////////////////////

const toRadians = degrees => degrees * (Math.PI / 180.0);
// const toDegrees = radians => radians * (180.0 / Math.PI);

class Rectangle {
  constructor( top, left, bottom, right ) {
    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
  }
  width() {
    return this.right - this.left;
  }
  height() {
    return this.bottom - this.top;
  }
  centerX() {
    return this.top + this.width() / 2;
  }
  centerY() {
    return this.top + this.height() / 2;
  }
  includes( x, y ) {
    return x >= this.left && x < this.right && y >= this.top && y < this.bottom;
  }
}


class SpiralCalculator {
  constructor( a, b, degreesIncrement ) {
    this.a = a;
    this.b = b;
    this.degreesIncrement = degreesIncrement;
    this.r = 0;
    this.theta = 0;
    this.nextTheta = 0;
  }
  getAngle() {
    return this.theta;
  }
  setAngle( newTheta ) {
    this.theta = newTheta;
    this.nextTheta = newTheta;
  }
  getAngleRadians() {
    return toRadians( this.theta );
  }
  get x() {
    return this.r * Math.cos( toRadians( this.theta ) );
  }
  get y() {
    return this.r * Math.sin( toRadians( this.theta ) );
  }
  advance() {
    this.theta = this.nextTheta;
    this.r = this.a * Math.pow( this.b, toRadians( this.theta ) );
    this.nextTheta = this.theta + this.degreesIncrement;
  }
}


class Spiral {
  constructor( a, b, boundingBox, segmentsPerRevolution ) {
    this.boundingBox = boundingBox;
    this.segmentsPerRevolution = segmentsPerRevolution;
    this.maxRadius = Math.sqrt(
      this.boundingBox.width() * this.boundingBox.width() +
      this.boundingBox.height() * this.boundingBox.height()
    );
    const spiralCalculator = new SpiralCalculator(
      a,
      b,
      360 / segmentsPerRevolution,
    );
    this.points = [];
    let pointsIndex = 0;
    while ( spiralCalculator.r <= this.maxRadius ) {
      this.points[ pointsIndex++ ] = {
        x: spiralCalculator.x,
        y: spiralCalculator.y,
        r: spiralCalculator.r,
      };
      spiralCalculator.advance();
    }
  }
  get d() {
    return this.points.reduce( ( result, currentPoint, index ) => {
      if ( !index ) return result;
      const radius = ( this.points[ index - 1 ].r + currentPoint.r ) / 2;
      return (
        result +
        `A ${ radius },${ radius } 0 0,1 ${ currentPoint.x } ${ currentPoint.y } `
      );
    }, "M 0,0 " );
    // + 'Z';
  }
  get reverseD() {
    return this.points.reverse().slice( this.segmentsPerRevolution / 2 ).reduce( ( result, currentPoint, index ) => {
      if ( !index ) return result + `L ${ currentPoint.x } ${ currentPoint.y } `;
      const radius = ( this.points[ index - 1 ].r + currentPoint.r ) / 2;
      return (
        result +
        `A ${ radius },${ radius } 0 0,0 ${ currentPoint.x } ${ currentPoint.y } `
      );
    }, "" );
    // + 'Z';
  }
}
