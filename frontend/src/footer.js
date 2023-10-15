import "./footer.css"
import React, { Component } from "react"

class Footer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email: "",
			msg: "",
		}
	}
    sendEmail(e){
        var data = new FormData();
        data.append("email", this.state.email)
        data.append("message", this.state.msg)
        console.log(this.state.email, this.state.msg);

        const sendMail = async () => {

			await fetch("http://localhost:8000/email",{
				method:"POST",body: data,mode: "cors"
			}).then(
			()=>{
			alert("Your msg has been sent successfully to you and binod!")
			})
		}
		sendMail();
    }
	render() {
		return (
			<footer className='footer' id='contact'>
				<div className='contact-form'>
					<div className='footer-title'>Contact Us</div>
					<input
						type='text'
						name='email'
						placeholder='Enter your email address'
                        onChange={(e) => { this.setState({ email: e.target.value}) }}
					/>
					<textarea name='email' placeholder='Enter you query' onChange={(e) => { this.setState({ msg: e.target.value })}}/>
					<button type='submit' onClick={(e) => {this.sendEmail(e)}}>Submit</button>
				</div>
				<div className='footer-details'>
					<a href='/' className='logo footer-menu'>
						Quick Links
					</a>
					<ul className='main-menu footer-menu'>
						<li className='active-menu'>
							<a href='#home'>Home</a>
						</li>
						<li>
							<a href='#product'>Products</a>
						</li>
						<li>
							<a href='#contact'>Contact</a>
						</li>
					</ul>
				</div>
			</footer>
		)
	}
}

export default Footer
