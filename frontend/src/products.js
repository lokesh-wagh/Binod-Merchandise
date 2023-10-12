import "./products.css"
import Aos from "aos"
import "aos/dist/aos.css"
import React, { Component } from "react"

import { Client, ID, Storage } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('[PROJECT_ID]');

const storage = new Storage(client);

class Product extends Component {
	constructor(props) {
		super(props)
		this.state = {
			products: [],
			title: "",
			size: "S",
			file: null,
			imageURL:"",
		}
	}
	componentDidMount() {
		Aos.init()
		const fetchProjects = async () => {
			const response = await fetch("http://localhost:8000/get_products")
			const fetchproducts = await response.json()
			this.setState(fetchproducts)
		}
		fetchProjects();
	}
	filter(id, event) {
		if (id !== "All") {
			var cproducts = this.state.products
			var fproducts = []
			cproducts.forEach((product) => {
				if (product.size !== id) {
					product.visible = false
				} else {
					product.visible = true
				}
				fproducts.push(product)
			})
			this.setState({ products: fproducts })
		} else {
			var cuproducts = this.state.products
			var fuproducts = []
			cuproducts.forEach((product) => {
				product.visible = true
				fuproducts.push(product)
			})
			this.setState({ products: fuproducts })
		}
		var filters = document.getElementsByName("filter");
		filters.forEach((filter) => {filter.className = ""});
		event.target.className = "active";
	}

	handleFileChange = (event) => {
		const file = event.target.files[0];
		this.setState({ file: file });
	  };
	
	  handleUpload =  () => {
		const { file } = this.state;
		if (file) {
		  const promise = storage.createFile('[BUCKET_ID]', ID.unique(), file);
		  promise.then(
			(response) => {
				const promise = storage.getFilePreview('[BUCKET_ID]',response.$id);
				this.setState({imageURL:promise.toString()})
			}
		  ).catch((error) => {
			alert(error)
		  });
		} else {
		  alert('No file selected');
		}
	  };
	DeleteProduct(e) {
		var mproduct = e.target.closest(".card")
		var cproducts = this.state.products
		var fproducts = []
		cproducts.forEach((product) => {
			if (product.name !== mproduct.querySelector(".card-title").innerHTML) {
				fproducts.push(product)
			}
			else{
				const deleteProjects = async () => {
					await fetch(`http://localhost:8000/delete_project/${product.key}`)
				}
				deleteProjects();
			}
		})
		this.setState({ products: fproducts })
	}
	onSubmit(e) {
		var cproducts = this.state.products
		var tproduct = cproducts.pop()
		cproducts.push(tproduct)
		var data = new FormData()
		data.append("title",this.state.title)
		data.append("size", this.state.size)
		data.append("key", tproduct.key + 1)
		data.append("imageURL", this.state.imageURL)
		const saveProjects = async () => {
			await fetch("http://localhost:8000/save_project",{
				method:"POST",body: data
			})
		}
		saveProjects();
		cproducts.push({
			key: tproduct.key + 1,
			name: this.state.title,
			size: this.state.size,
			imageURL: this.state.imageURL,
			visible: true,
		})
		this.setState({ products: cproducts, title: "", size: "S", imageURL: ""})
	}
	render() {
		var products = this.state.products.map((product) => {
			if (product.visible) {
				return (
					<div className={`card `} data-aos='zoom-in'>
						<img src={product.imageURL} className="card-image" alt="product"/>
						<div className='card-size'>{product.size}</div>
						<div className='card-title'>{product.name}</div>
						<button
							className='card-delete'
							onClick={(e) => {
								this.DeleteProduct(e)
							}}
						/>
					</div>
				)
			} else {
				return null
			}
		})
		products.push(
			<div className={`card add`} data-aos='zoom-in'>
				<form onSubmit={(e) => this.onSubmit(e)} on>
					<select
						className='card-size-selector'
						placeholder='Size'
						onChange={(e) => this.setState({ size: e.target.value })}>
						<option>S</option>
						<option>M</option>
						<option>L</option>
						<option>XL</option>
					</select>
					<input
						type='text'
						className='card-title'
						placeholder='Enter card title'
						onChange={(e) => this.setState({ title: e.target.value })}
						required
					/>
					<input type="file" accept="image/*" onChange={this.handleFileChange} className="uploader"/>
					<button onClick={this.handleUpload} className="card-add-button"/>
				</form>
			</div>
		)
		return (
			<div className='product' id='product'>
				<div className='product-title'>Our Merch</div>
				<div className='product-filter'>
					<button name="filter" className='active' onClick={(e) => this.filter("All", e)}>
						All
					</button>
					<button name="filter" onClick={(e) => this.filter("S", e)}>S</button>
					<button name="filter" onClick={(e) => this.filter("M", e)}>M</button>
					<button name="filter" onClick={(e) => this.filter("L", e)}>L</button>
					<button name="filter" onClick={(e) => this.filter("XL", e)}>XL</button>
				</div>
				<div className='products'>{products}</div>
			</div>
		)
	}
}

export default Product
