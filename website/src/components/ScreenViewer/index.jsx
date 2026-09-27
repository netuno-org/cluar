import { useEffect, useRef, useState } from "react";

import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { Flex, FloatButton } from "antd";
import { connect } from "react-redux";

import "./index.less";

const defaultScreenSize = { width: 1280, height: 720 };

const dimensionPresets = {
  mobileSmall: { width: 320, height: 568 },
  mobileMedium: { width: 375, height: 667 },
  mobileLarge: { width: 414, height: 896 },
  tabletSmall: { width: 768, height: 1024 },
  tabletMedium: { width: 820, height: 1180 },
  tabletLarge: { width: 1024, height: 1366 },
  desktopSmall: { width: 1280, height: 720 },
  desktopMedium: { width: 1440, height: 900 },
  desktopLarge: { width: 1920, height: 1080 },
};

const ScreenViewer = ({ children, loggedUserInfo }) => {
  const [screenSizeActive, setScreenSizeActive] = useState(false);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [frameSizeInputs, setFrameSizeInputs] = useState({
    width: "",
    height: "",
  });
  const [selectedPreset, setSelectedPreset] = useState("");
  const editingDimensionRef = useRef(null);
  const frameRef = useRef(null);

  const isEmbedded =
    new URLSearchParams(window.location.search).get("embed") === "1";

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame || !screenSizeActive) return undefined;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const borderBoxSize = entry.borderBoxSize?.[0];
      const width = Math.round(
        borderBoxSize?.inlineSize ?? entry.contentRect.width,
      );
      const height = Math.round(
        borderBoxSize?.blockSize ?? entry.contentRect.height,
      );

      if (width <= 0 || height <= 0) return;

      setFrameSize((currentSize) => {
        if (currentSize.width === null || currentSize.height === null) {
          return currentSize;
        }

        if (currentSize.width === width && currentSize.height === height) {
          return currentSize;
        }

        if (editingDimensionRef.current === null) {
          setFrameSizeInputs({
            width: String(width),
            height: String(height),
          });
        }

        return { width, height };
      });
    });

    resizeObserver.observe(frame);
    return () => resizeObserver.disconnect();
  }, [screenSizeActive]);

  if (isEmbedded) return <div className="embed-wrapper">{children}</div>;

  const toggleScreenViewer = () => {
    if (screenSizeActive) {
      setScreenSizeActive(false);
      return;
    }

    setSelectedPreset("desktopMedium");
    setScreenSizeActive(true);
    setFrameSize(defaultScreenSize);
    setFrameSizeInputs({
      width: String(defaultScreenSize.width),
      height: String(defaultScreenSize.height),
    });
  };

  const handleFrameSizeChange = (dimension, value) => {
    setSelectedPreset("");
    setFrameSizeInputs((currentSize) => ({
      ...currentSize,
      [dimension]: value,
    }));
  };

  const handleFrameSizeCommit = (dimension) => {
    const value = frameSizeInputs[dimension];

    if (value === "") {
      setFrameSize((currentSize) => ({
        ...currentSize,
        [dimension]: null,
      }));
      return;
    }

    const nextValue = Number(value);

    if (Number.isFinite(nextValue) && nextValue > 0) {
      setFrameSize((currentSize) => ({
        ...currentSize,
        [dimension]: nextValue,
      }));
      setFrameSizeInputs((currentSize) => ({
        ...currentSize,
        [dimension]: String(nextValue),
      }));
    }
  };

  const handlePresetChange = (event) => {
    const preset = dimensionPresets[event.target.value];

    if (!preset) {
      setSelectedPreset("");
      return;
    }

    setSelectedPreset(event.target.value);
    setFrameSize(preset);
    setFrameSizeInputs({
      width: String(preset.width),
      height: String(preset.height),
    });
  };

  const handleFrameSizeKeyDown = (event) => {
    if (event.key === "Enter") event.currentTarget.blur();
  };

  const embedSrc = `${window.location.pathname}?embed=1`;
  const canUseScreenViewer = loggedUserInfo?.groups?.some(
    (group) => group?.code === "administrator" || group?.code === "editor",
  );

  return (
    <div>
      {screenSizeActive && (
        <>
          <div className="screen-viewer-toolbar">
            <strong>Dimensões</strong>
            <label>
              Preset
              <select value={selectedPreset} onChange={handlePresetChange}>
                <option value="">Selecionar</option>
                <optgroup label="Mobile">
                  <option value="mobileSmall">320 x 568</option>
                  <option value="mobileMedium">375 x 667</option>
                  <option value="mobileLarge">414 x 896</option>
                </optgroup>
                <optgroup label="Tablet">
                  <option value="tabletSmall">768 x 1024</option>
                  <option value="tabletMedium">820 x 1180</option>
                  <option value="tabletLarge">1024 x 1366</option>
                </optgroup>
                <optgroup label="Desktop">
                  <option value="desktopSmall">1280 x 720</option>
                  <option value="desktopMedium">1440 x 900</option>
                  <option value="desktopLarge">1920 x 1080</option>
                </optgroup>
              </select>
            </label>
            <label>
              Largura
              <input
                type="number"
                min="200"
                value={frameSizeInputs.width}
                onFocus={() => {
                  editingDimensionRef.current = "width";
                }}
                onChange={(event) =>
                  handleFrameSizeChange("width", event.target.value)
                }
                onBlur={() => {
                  handleFrameSizeCommit("width");
                  editingDimensionRef.current = null;
                }}
                onKeyDown={handleFrameSizeKeyDown}
              />
              <span>px</span>
            </label>
            <label>
              Altura
              <input
                type="number"
                min="200"
                value={frameSizeInputs.height}
                onFocus={() => {
                  editingDimensionRef.current = "height";
                }}
                onChange={(event) =>
                  handleFrameSizeChange("height", event.target.value)
                }
                onBlur={() => {
                  handleFrameSizeCommit("height");
                  editingDimensionRef.current = null;
                }}
                onKeyDown={handleFrameSizeKeyDown}
              />
              <span>px</span>
            </label>
          </div>
          <Flex
            justify="center"
            align="flex-start"
            className="screen-viewer-sizes"
          >
            <iframe
              ref={frameRef}
              title="screen-viewer"
              src={embedSrc}
              className="screen-viewer-sizes__wrapper"
              style={{
                width: frameSize.width,
                height: frameSize.height,
              }}
            />
          </Flex>
        </>
      )}

      <div
        style={{ display: screenSizeActive ? "none" : "block" }}
        className="template-wrapper"
      >
        {children}
      </div>

      {canUseScreenViewer && (
        <FloatButton
          style={{ insetInlineEnd: 24 }}
          icon={screenSizeActive ? <CloseOutlined /> : <EyeOutlined />}
          onClick={toggleScreenViewer}
          tooltip={
            screenSizeActive ? "Fechar visualização" : "Abrir visualização"
          }
        />
      )}
    </div>
  );
};

const mapStateToProps = (store) => ({
  loggedUserInfo: store.loggedUserInfoState?.loggedUserInfo,
});

export default connect(mapStateToProps)(ScreenViewer);
