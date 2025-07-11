import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { Row, Col, Button, Slider, Divider } from 'antd';
import {useDropzone} from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import Cluar from '../../../../common/Cluar';

function Avatar({currentImage}, ref) {
  const [image, setImage] = useState(currentImage);
  const [scale, setScale] = useState(1.0);
  const [rotate, setRotate] = useState(0);
  const [position, setPosition] = useState(undefined);
  const [color, setColor] = useState('#ffffff');
  const {getRootProps, getInputProps, open} = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop: ([image]) => setImage(image)
  });
  useEffect(() => {
    setImage(null);
    setTimeout(() => setImage(currentImage), 250);
  }, [currentImage]);
  const refAvatarEditor = useRef(null);
  useImperativeHandle(ref, () => ({
    getImage: ()=> imageEditing ? refAvatarEditor?.current?.getImage().toDataURL() : null
  }));
  const imageEditing = image && typeof(image) !== 'string';
  return (
    <Row gutter={[16, 16]}>
      <Col>
        <div {...getRootProps()}>
          <AvatarEditor
            ref={refAvatarEditor}
            image={image}
            width={250}
            height={250}
            border={imageEditing ? 25 : 0}
            borderRadius={250}
            backgroundColor={color}
            scale={scale}
            rotate={rotate}
            position={position}
            onPositionChange={(position)=> setPosition(position)}
          />
          <input
            name="newImage"
            type="file"
            onChange={(e) => e.target.files?.[0] && setImage(e.target.files[0])}
            {...getInputProps()}
          />
        </div>
      </Col>
        <Col>
          <p><Button onClick={open} type="primary" ghost>{Cluar.plainDictionary('profile-form-image-upload')}</Button></p>
          { imageEditing &&
            <>
              <Divider orientation="left" plain>{Cluar.plainDictionary('profile-form-image-config')}</Divider>
              <p>
              {Cluar.plainDictionary('profile-form-image-scale')}<Slider min={0.5} max={1.5} defaultValue={scale} step={0.01} onChange={(value) => setScale(value)}></Slider>
              </p>
              <p>
              {Cluar.plainDictionary('profile-form-image-ratation')}<Slider min={-180} max={180} defaultValue={rotate} step={1} onChange={(value) => setRotate(value)}></Slider>
              </p>
              <p>
              {Cluar.plainDictionary('profile-form-image-background-color')}<input type="color" defaultValue={color} onChange={(e) => setColor(e.target.value)}/>
                <br/><i>{Cluar.plainDictionary('profile-form-image-background-color-description')}</i>
              </p>
              <p>
                <Button onClick={() => setImage(currentImage)} type="dashed" danger>{Cluar.plainDictionary('profile-form-image-undo')}</Button>
              </p>
            </>
          }
        </Col>
    </Row>
  );
}

export default React.forwardRef(Avatar);