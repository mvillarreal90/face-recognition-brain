import React from 'react';
import brain from './icon-brain.png';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<div style={{ height: 120, width: 120 }}>
				<img alt="brain" src={brain}/>
			</div>
		</div>
	)
}

export default Logo;