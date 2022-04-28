import React from './react'
import T from './prop-types'
import {Canvas3D} from './troika-3d'
import Sphere from './Sphere'
import { ExampleConfigurator } from '../_shared/ExampleConfigurator.js'

const ANIM_DUR = 5000

const repeatableRandoms = []
for (let i = 0; i < 8; i++) repeatableRandoms.push(Math.random())


class LevelOfDetailExample extends React.Component {
  constructor(props) {
    super(props)
    this.toggleWireframe = this.toggleWireframe.bind(this)
    this.state = {
      wireframe: true
    }
  }

  toggleWireframe() {
    this.setState({wireframe: !this.state.wireframe})
  }

  render() {
    let state = this.state
    let {width, height} = this.props

    return (
      <div>
        <Canvas3D
          antialias
          stats={ this.props.stats }
          width={ width }
          height={ height }
          lights={ [
            { type: 'ambient', color: 0x666666 },
            { type: 'point', color: 0xffffff, x: width / 4, y: height / -4, z: 500 }
          ] }
          camera={ {
            z: 5,
          } }
          objects={ [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]].map(([x, y], i) => (
            {
              key: `sphere${i}`,
              facade: Sphere,
              x: x * 3,
              y: y * 3,
              wireframe: state.wireframe,
              animation: {
                0: {z: 0},
                100: {z: -75},
                duration: ANIM_DUR,
                iterations: Infinity,
                direction: 'alternate',
                easing: 'easeInOutQuad',
                delay: repeatableRandoms[i] * ANIM_DUR * -2
              }
            }
          )).concat(
            {
              key: 'config',
              isXR: !!this.props.vr,
              facade: ExampleConfigurator,
              data: state,
              onUpdate: this.setState.bind(this),
              items: [
                {type: 'boolean', path: 'wireframe', label: 'Wireframe'}
              ]
            }
          ) }
        />

        <div className="example_desc">
          <p>Dynamic level-of-detail based on distance from the camera. Simple logic in <code>afterUpdate</code> calls <code>this.getCameraDistance()</code> and chooses an appropriate geometry based on the result. This could also be done based on other parameters such as object size, object velocity, or frame rate.</p>
        </div>
      </div>
    )
  }
}

LevelOfDetailExample.propTypes = {
  width: T.number,
  height: T.number
}

export default LevelOfDetailExample
