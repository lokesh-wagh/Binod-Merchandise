import "./navbar.css"

function Navbar() {
	return (
		<nav className='navbar'>
			<a href='/' className='logo'>
				Binod Merchandise
			</a>
			<div className='menu'>
				<ul className='main-menu'>
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
		</nav>
	)
}

export default Navbar
