import React from 'react';

function ImageDetail({ imageName }) {
  return (
    <div className="ui two column stackable grid">
      <div className="row">
        <div className="column">
          <div className="ui rounded image">
            <img src="https://www.petmd.com/sites/default/files/Acute-Dog-Diarrhea-47066074.jpg" />
          </div>
          <p></p>
          <button className="ui primary button">Download annotation</button>
        </div>
        <div className="column">
          <div className="ui left aligned red segment">
            <div className="ui center aligned header">Image details</div>
            <p>Author: Chun</p>
            <p>Uploaded at: 2019/10/11</p>
          </div>
          <div className="ui segments">
            <div className="ui left aligned blue segment">
              <div className="ui center aligned header">Bounding boxes</div>
            </div>
            <div className="ui segments">
              <div className="ui left aligned segment">
                <div className="ui header">dog</div>
                <p>
                  <button class="ui icon button">100</button>
                  <button class="ui icon button">234</button>
                  <button class="ui icon button">245</button>
                  <button class="ui icon button">356</button>
                </p>
              </div>
              <div className="ui left aligned segment">
                <div className="ui header">cat</div>
                <p>
                  <button class="ui icon button">100</button>
                  <button class="ui icon button">234</button>
                  <button class="ui icon button">245</button>
                  <button class="ui icon button">356</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageDetail;