import React from 'react';
import './style.css';
import { Link } from "react-router-dom";

class Signin extends React.Component {
    constructor() {
      super();
      this.state = {
        fields: {},
        errors: {}
      }

      this.handleChange = this.handleChange.bind(this);
      this.submituserRegistrationForm = this.submituserRegistrationForm.bind(this);

    };

    handleChange(e) {
      let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
      this.setState({
        fields
      });

    }
    submituserRegistrationForm(e) {
      e.preventDefault();
      if (this.validateForm()) {
        const data = this.state.fields
        fetch("https://demo-app-wysa.herokuapp.com/signin",{
          headers: {
            'Content-type': 'application/json',
           },
          method: "POST",
          body: JSON.stringify(data),
        }).then((response) =>{
          if(response.status === 200){
            response.json().then((data)=>{
                localStorage.setItem("userId", data.user._id);
                window.open('/onboarding', '_self')
            })
          }else{
            response.json().then((data)=>{
                let errors = {};
                errors["password"] = data.message;
                this.setState({
                    errors: errors
                });
            })
          }
        })
      }
    }

    validateForm() {
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      if (!fields["username"]) {
        formIsValid = false;
        errors["username"] = "*Please enter your username.";
      }

      if (typeof fields["username"] !== "undefined") {
        if (!fields["username"].match(/^[a-zA-Z ]*$/)) {
          formIsValid = false;
          errors["username"] = "*Please enter alphabet characters only.";
        }
      }

      if (!fields["password"]) {
        formIsValid = false;
        errors["password"] = "*Please enter your password.";
      }

      this.setState({
        errors: errors
      });
      return formIsValid;

    }

  render() {
    return (
    <div id="main-registration-container">
     <div id="register">
        <h3>Sign In</h3>
        <form method="post"  name="userRegistrationForm"  onSubmit= {this.submituserRegistrationForm} >
        <label>Name</label>
        <input type="text" name="username" value={this.state.fields.username} onChange={this.handleChange} />
        <div className="errorMsg">{this.state.errors.username}</div>
        <label>Password</label>
        <input type="password" name="password" value={this.state.fields.password} onChange={this.handleChange} />
        <div className="errorMsg">{this.state.errors.password}</div>
        <input type="submit" className="button"  value="Sign In"/>
        </form>
        <Link to="/">New Account</Link>
    </div>
</div>

      );
  }


}


export default Signin;