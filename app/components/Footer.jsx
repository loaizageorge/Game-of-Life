import React from 'react';

class Footer extends React.Component{
  render(){
    return(
      <div className = "footer" >
        <a href = "http://georgeloaiza.com" target = "_blank">George Loaiza</a>
        <a href = "https://github.com/xchendo" target = "_blank"><i className="fa fa-github" aria-hidden="true"></i></a>
        <a href = "https://codepen.io/xchendo/" target = "_blank"><i className="fa fa-codepen" aria-hidden="true"></i></a>
        <a href = "https://www.freecodecamp.com/xchendo" target = "_blank"><i className="fa fa-free-code-camp" aria-hidden="true"></i></a>
      </div>
    );
  }

}

export default Footer;
