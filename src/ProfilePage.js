import React, { useState, useEffect } from 'react';
import { useAuth, getUserDoc, updateUserDoc } from './use-auth';
import './App.css';

function ProfilePage() {
	const auth = useAuth();
	const auth_user = auth.user;
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [language, setLanguage] = useState('');
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		getUser();
	}, []);

	const getUser = async () => {
		if (auth.user) {
			const user = await getUserDoc(auth_user.uid);
			setName(user.displayName);
			setEmail(user.email);
			setLanguage(user.language);
		}
	};

	const onSaveHandler = (event) => {
		event.preventDefault();
		const data = {
			language: language
		};
		const res = updateUserDoc(auth_user.uid, data);
		if (!(res instanceof Error)) {
			setSaveSuccess(true);
			setTimeout(() => {setSaveSuccess(false);}, 3000);
		} else {
			setError(res);
		}
	};

	const onChangeHandler = (event) => {
		event.preventDefault();
		const {name, value} = event.currentTarget;
		if (name === 'native_language') {
			setLanguage(value);
		}
	};

	return (
		<div className='ProfilePage body-container'>
		{auth_user ? (
			<div>
				<div>
					<h2>{name}</h2>
					<h5>{email}</h5>
				</div>
				<div><br/><br/></div>
				<div>
					<h3>Update Information</h3>
					<form>
						<label>
							<span>Native Language: </span>
							<select name='native_language' value={language} onChange={(event) => onChangeHandler(event)}>
								<option value="Spanish">Spanish</option>
								<option value="French">French</option>
								<option value="German">German</option>
							</select>
						</label>
						<p>Target Language: English</p>
						<button className='Save yellow-button' onClick={(event) => onSaveHandler(event)}>Save</button>
					</form>
					<div>
						{saveSuccess ? <p className='success'>Profile updated successfully!</p> : <p>{error}</p>}
					</div>
				</div>
			</div>
		) : (
			<h3>Could not retrieve user data.</h3>
		)}
		</div>
	);
}

export default ProfilePage;