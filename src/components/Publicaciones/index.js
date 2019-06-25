import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../General/Spinner';
import Fatal from '../General/Fatal';

import * as usuariosActions from '../../actions/usuariosActions';
import * as publicacionesActions from '../../actions/publicacionesActions';
import { arrowFunctionExpression } from '@babel/types';

const { traerTodos: usuariosTraerTodos } = usuariosActions;
const { traerPorUsuario: publicacionesTraerPorUsuario } = publicacionesActions;

class Publicaciones extends Component {

	async componentDidMount() {
		const {
			usuariosTraerTodos,
			publicacionesTraerPorUsuario,
			match: { params: { key} }
		} = this.props
		
		if (!this.props.usuariosReducer.usuarios.length) {
			await usuariosTraerTodos();
		}
		if(this.props.usuariosReducer.error) {
			return;
		}
		if(!('publicaciones_key' in this.props.usuariosReducer.usuarios[key])){
			publicacionesTraerPorUsuario(key);
		}
	}

	ponerUsuario = () => {
		const {
			usuariosReducer,
			match: { params : { key } }
		} = this.props;

		if(usuariosReducer.error) {
			return <Fatal mensaje={ usuariosReducer.error } />
		}

		if(!usuariosReducer.usuarios.length || usuariosReducer.cargando) {
			return <Spinner />
		}

		const nombre = usuariosReducer.usuarios[key].name

		return (
			<h1>
				Publicaciones de {nombre}
			</h1>
		)
	}

	ponerPublicaciones = () => {
		const {
			usuariosReducer,
			usuariosReducer: {usuarios},
			publicacionesReducer,
			publicacionesReducer: {publicaciones},
			match: { params : { key } }
		} = this.props

		if(!usuarios.length) return;
		if(usuariosReducer.error) return;
		
		if(publicacionesReducer.cargando) {
			return <Spinner />
		}
		if(publicacionesReducer.error) {
			return <Fatal mensaje={publicacionesReducer.error} />
		}
		if(!publicaciones.length) return;
		if(!('publicaciones_key' in usuarios[key])) return;

		const { publicaciones_key } = usuarios[key];
		return publicaciones[publicaciones_key].map((publicacion) =>(
			<div className="pub_titulo" key={publicacion.id} onClick={ ()=> alert(publicacion.id)}>
				<h2>
					{/* la publicacion esta en e Json como title */}
					{publicacion.title}
				</h2>
				<h3>
					{publicacion.body}
				</h3>
			</div>
		));
};
	


	render() {
		console.log(this.props);
		return (
			<div>
				{ this.ponerUsuario() }
				{ this.ponerPublicaciones() }
			</div>
		)
	}
}

const mapStateToProps = ({ usuariosReducer, publicacionesReducer }) => {
	return { usuariosReducer, publicacionesReducer };
};

const mapDispatchToProps = {
	usuariosTraerTodos,
	publicacionesTraerPorUsuario
};

export default connect(mapStateToProps, mapDispatchToProps)(Publicaciones);
