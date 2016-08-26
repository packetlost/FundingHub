import React from 'react';

const Status = (props) => {
  return (
    <div id="status" className={"alert alert-"+props.statusType}>
      <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
      {props.statusMessage}
    </div>
  );
}

export default Status;
