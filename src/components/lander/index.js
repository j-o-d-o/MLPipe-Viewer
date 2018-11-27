import React from 'react';
import { Parallax } from 'react-parallax';


class Lander extends React.Component {
    constructor(props) {
        super(props);

        this.scrollToEndOfHero = this.scrollToEndOfHero.bind(this);
    }

    scrollToEndOfHero() {
        this.heroEnd.scrollIntoView({block: "start", behavior: "smooth"});
    }

    render(){
        return(
            <div id="lander">
                <Parallax
                    className="hero"
                    blur={0}
                    bgImage={'images/hero.svg'}
                    bgImageAlt="hero"
                    strength={300}
                >
                    <div id="info-hero">
                        <div id="header1">
                            <img src="images/icon.svg" alt="icon" />
                            <h1>MLPipe</h1>
                        </div>
                        <div id="header2"><h2>Your Machine Learning Data Pipeline</h2></div>
                    </div>
                    <div id="explore-button-wrapper" onClick={this.scrollToEndOfHero}>
                        <div className="explore-button"><i className="material-icons">keyboard_arrow_down</i></div>
                    </div>
                    <div style={{ height: '100vh' }} />
                </Parallax>
                <div style={{height: "0px"}} ref={(el) => { this.heroEnd = el; }}></div>

                <div className="lander-section mdc-elevation--z7" id="section-1">
                    <div id="info">
                        <div id="content">
                            <h2>Focus on Results</h2>
                            <h3>and not on your toolchain</h3>
                            <div id="text">
                                A crutial part of successfull machine learning is your toolchain. Reproducability ... Lore 
                                ipsum Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor 
                                invidunt ut labore et dolore magna aliquyam  At vero eos et accusam et justo duo dolores et ea rebum.
                                Stet clita kasd gubergren, no sea takimata sanctus est
                            </div>
                        </div>
                    </div>
                    <div id="img-wrapper"><img src="images/vector_img.svg" alt="distributed-svg" /></div>
                </div>

                <Parallax
                    blur={0}
                    bgImage={'images/hero.svg'}
                    bgImageAlt="hero"
                    strength={180}
                >
                    <div className="parallalx-section" />
                </Parallax>

                <div className="lander-section">

                </div>

                <div className="lander-section" style={{background: "#eee"}}>
                
                </div>
            </div>
        ); 
    }
}

export default Lander