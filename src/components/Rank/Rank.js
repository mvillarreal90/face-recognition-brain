import React from 'react';

const Rank = ({ userName, entries }) => {
	return (
		<div>
			<div className='white f3'>
				{`${userName}, your current entry count is...`}
			</div>
			<div className='white f1'>
				{entries}
			</div>
		</div>
	);
}

export default Rank;