import React from 'react';
import { Parallax } from 'react-parallax';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';


class Lander extends React.Component {
    scrollToEndOfHero = () => {
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
                                With increased useage of Machine Learning within systems the risk of technical debt 
                                also increases and is not always visible from the start. MLPipe is helping to reduce these technical debts by
                                addressing specific engineering topics such as data pipelining, process management, reproducibility, configuration, and
                                training distribution & monitoring. This enables you to focus on the actual research part to improve performance
                                while easily scale, collaborate within a team to get results faster and more efficient.
                            </div>
                        </div>
                    </div>
                    <div id="img-wrapper"><img src="images/vector_img.svg" alt="distributed-svg" /></div>
                </div>

                <Parallax
                    blur={0}
                    className="parallax-section-wrapper"
                    bgImage={'images/hero.svg'}
                    bgImageAlt="hero"
                    strength={180}
                >
                    <div className="parallalx-section" />
                </Parallax>

                <div className="lander-section description-section--reverse">
                    <div className="card-image card-image--left">
                        <img src="images/cloud-service.svg" alt="cloud-service" />
                    </div>
                    <div className="card-text">
                        <div className="card-text--content">
                            <h1>Cloud Training</h1>
                            <h2>It is there when you need it</h2>
                            <div className="text">
                                The cloud is a perfect place for training Machine Learning models. It is not always easy 
                                to predict the computing power needed and the needs are highly fluctuating.<br></br>
                                Cloud computing solves both of these problems while reducing the costs.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lander-section description-section">
                    <div className="card-text">
                        <div className="card-text--content">
                            <h1>Data Piplines</h1>
                            <h2>Pre- and Post process your data</h2>
                            <div className="text">
                                Data is where most of the technical debt in Machine Learning systems is hidden.<br></br>
                                MLPipe offers integrated, reproducable and easy to use 
                                data piplines during training and inference.
                            </div>
                        </div>
                    </div>
                    <div className="card-image card-image--right">
                        <img src="images/data_pipline.svg" alt="cloud-service" />
                    </div>
                </div>


                <div className="lander-section description-section--reverse">
                    <div className="card-image card-image--left">
                        <img src="images/collaboration.svg" alt="cloud-service" />
                    </div>
                    <div className="card-text">
                        <div className="card-text--content">
                            <h1>Collaboration</h1>
                            <h2>Scale teams as you grow</h2>
                            <div className="text">
                                Scaling Machine Learning teams and organizations for larger projects
                                is a challange itself.<br></br>
                                Increase collaboration with MLPipe with the included managament for trained Models 
                                and current resources combined with its sufficticated analysis tools to compare results.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lander-section" style={{minHeight: "100px"}}></div>

                <Parallax
                    blur={0}
                    className="parallax-section-wrapper-2"
                    bgImage={'images/second_parallax.jpg'}
                    bgImageAlt="hero"
                    strength={180}
                >
                    <div className="parallalx-section-2" />
                </Parallax>

                <div className="lander-section get-in-touch">
                    <div className="get-in-touch--content">
                        <h1>Get in touch</h1>
                        <h2>And boost your future</h2>
                        <form onSubmit={(e) => {e.preventDefault(); window.alert("Not implemented yet :/");}}>
                            <TextField className="email" label="Your Email" name="email" required={true}/>
                            <textarea placeholder="Your Message" className="textarea"/>
                            <Button raised className="submit">Send Message</Button>
                        </form>
                    </div>
                </div>
            </div>
        ); 
    }
}

export default Lander