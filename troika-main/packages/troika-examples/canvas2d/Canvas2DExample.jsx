import React from './react'
import T from './prop-types'
import {Canvas2D, Group2DFacade, Object2DFacade, HtmlOverlay2DFacade, Text2DFacade} from './troika-2d'



class CircleFacade extends Object2DFacade {
  constructor(...args) {
    super(...args)
    this.onMouseOver = e => {
      this.hovered = true
    }
    this.onMouseOut = e => {
      this.hovered = false
    }
  }

  render(ctx) {
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    if (this.fill) {
      ctx.fillStyle = this.hovered ? '#fff' : this.fill
      ctx.fill()
    }
    if (this.stroke) {
      ctx.lineWidth = 5
      ctx.strokeStyle = this.hovered ? '#fff' : this.stroke
      ctx.stroke()
    }
  }
}

class RectFacade extends Object2DFacade {
  constructor(...args) {
    super(...args)
    this.onMouseOver = e => {
      this.hovered = true
    }
    this.onMouseOut = e => {
      this.hovered = false
    }
  }

  render(ctx) {
    ctx.beginPath()
    ctx.rect(0, 0, this.width, this.height)
    if (this.fill) {
      ctx.fillStyle = this.hovered ? '#fff' : this.fill
      ctx.fill()
    }
    if (this.stroke) {
      ctx.lineWidth = 5
      ctx.strokeStyle = this.hovered ? '#fff' : this.stroke
      ctx.stroke()
    }
  }
}

export class TwoDeeScene extends Group2DFacade {
  constructor(parent) {
    super(parent)

    this.children = [
      {
        key: 'circle1',
        facade: CircleFacade,
        x: 100,
        y: 100,
        r: 50,
        fill: 'blue',
        animation: {
          from: {r: 20},
          to: {r: 50},
          duration: 1000,
          iterations: Infinity,
          direction: 'alternate'
        }
      },
      {
        key: 'circle2',
        facade: CircleFacade,
        x: 100,
        y: 300,
        r: 50,
        stroke: 'blue',
        animation: {
          from: {r: 20, scaleX: 1},
          to: {r: 50, scaleX: 2},
          duration: 1000,
          iterations: Infinity,
          direction: 'alternate'
        }
      },
      {
        key: 'group1',
        facade: Group2DFacade,
        x: 300,
        y: 300,
        scaleY: 2,
        animation: {
          from: {rotate: 0},
          to: {rotate: Math.PI * 2},
          duration: 5000,
          iterations: Infinity
        },
        children: [
          {
            key: 'circle1',
            facade: CircleFacade,
            x: -100,
            r: 25,
            fill: '#090',
            scaleY: 2,
            animation: {
              from: {rotate: 0},
              to: {rotate: Math.PI * 2},
              duration: 2000,
              iterations: Infinity,
            }
          },
          {
            key: 'circle2',
            facade: CircleFacade,
            x: 100,
            r: 25,
            stroke: '#090',
            scaleY: 2,
            children: [0, 1, 2, 3].map(i => ({
              key: `html${i}`,
              facade: HtmlOverlay2DFacade,
              x: 25 * Math.cos(Math.PI * i / 2),
              y: 25 * Math.sin(Math.PI * i / 2),
              html: <em style={ {color: '#fff', textShadow: '0 0 1px #000'} }>{ i }</em>
            })),
            animation: {
              from: {rotate: 0},
              to: {rotate: Math.PI * -2},
              duration: 2000,
              iterations: Infinity,
            }
          }
        ]
      },
      {
        key: 'hitTest',
        facade: Group2DFacade,
        children: [
          {
            key: '1',
            facade: RectFacade,
            x: 0,
            y: 600,
            width: 100,
            height: 100,
            fill: '#600'
          },
          {
            key: '2',
            facade: RectFacade,
            x: 50,
            y: 650,
            width: 100,
            height: 100,
            fill: '#900'
          },
          {
            key: '3',
            facade: RectFacade,
            x: 100,
            y: 700,
            width: 100,
            height: 100,
            fill: '#c00'
          }
        ]
      },
      {
        key: 'zIndexChanges',
        facade: Group2DFacade,
        x: 300,
        y: 500,
        children: [0,1,2,3,4,5,6,7].map(i => ({
          key: `${i}`,
          facade: RectFacade,
          x: i * 20,
          y: 0,
          width: 50,
          height: 50,
          fill: `rgb(100, ${Math.floor(255 * i / 8)}, 100)`,
          animation: {
            from: {y: 0, z: 0},
            to: {y: 100, z: 100},
            duration: 2000,
            iterations: Infinity,
            direction: 'alternate',
            delay: 2000 * i / 8
          }
        }))
      },
      {
        key: 'text',
        facade: Text2DFacade,
        text: 'Canvas Text',
        fontSize: '25px',
        color: '#FFF',
        x: 600,
        y: 400,
        animation: {
          from: {scaleX: 1, scaleY: 0.25},
          to: {scaleX: 0.25, scaleY:1},
          iterations: Infinity,
          direction: 'alternate',
          duration: 1500
        }
      }
    ]
  }
}


class Canvas2DExample extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let {width, height} = this.props

    return (
      <div>
        <Canvas2D
          stats={ this.props.stats }
          width={ width }
          height={ height }
          objects={ {
            key: 'scene',
            facade: TwoDeeScene
          } }
        />

        <div className="example_desc">
          This example demonstrates Troika's support for 2D canvas scenes. It works just like 3D, with full support
          for animations and mouse interaction, but instead of managing Three.JS objects each Object2DFacade implements
          a <code>render(ctx)</code> method which draws to the context using the Canvas 2D API.
        </div>
      </div>
    )
  }
}

Canvas2DExample.propTypes = {
  width: T.number,
  height: T.number
}

export default Canvas2DExample
