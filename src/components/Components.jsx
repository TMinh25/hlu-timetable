import React, { useCallback, useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { defaultFailCB } from '../utils';
import { useDropzone } from 'react-dropzone';

// import components
import logo from '../logo.svg';
import PropTypes from 'prop-types';

// import styles
import './Components.css';

//#region Logo & Loading

export const Logo = props => (
  <Link to="/" onClick={props.onClick}>
    <div className="app-logo-container">
      <img src={logo} className="app-logo" alt="logo" />
      <p>
        Hạ Long
        <br />
        University
      </p>
    </div>
  </Link>
);

export const Loading = () => (
  <>
    <div className="loading">
      <img src={logo} className="app-logo-loading" alt="logo" />
    </div>
  </>
);

//#endregion

//#region Button

export const LinkButton = props => {
  const { children, className } = props;
  const fixedClassName = className ? className : '';
  return (
    <>
      <Link {...props} className={`button ${fixedClassName}`}>
        {children}
      </Link>
    </>
  );
};

export const Button = ({
  title,
  style,
  type,
  className,
  onClick,
  children,
}) => {
  return (
    <>
      <button
        title={title}
        style={style}
        type={type}
        className={`button ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};

export const DropDownHoverButton = ({
  children,
  onMenuClick,
  item1,
  item1Link,
  item2,
  item2Link,
  item3,
  item3Link,
  item4,
  item4Link,
  item5,
  item5Link,
  title,
}) => {
  return (
    <>
      <div
        title={title}
        className="button dropdown-button"
        onClick={onMenuClick}
      >
        {children}
        <ul className="dropdown_menu">
          {item1 && item1Link && (
            <Link to={item1Link}>
              <li className="dropdown_item dropdown_item-1">{item1}</li>
            </Link>
          )}
          {item2 && item2Link && (
            <Link to={item2Link}>
              <li className="dropdown_item dropdown_item-2">{item2}</li>
            </Link>
          )}
          {item3 && item3Link && (
            <Link to={item3Link}>
              <li className="dropdown_item dropdown_item-3">{item3}</li>
            </Link>
          )}
          {item4 && item4Link && (
            <Link to={item4Link}>
              <li className="dropdown_item dropdown_item-4">{item4}</li>
            </Link>
          )}
          {item5 && item5Link && (
            <Link to={item5Link}>
              <li className="dropdown_item dropdown_item-5">{item5}</li>
            </Link>
          )}
        </ul>
      </div>
    </>
  );
};

//#endregion

//#region Excel Dropzone

export const FileDropzone = ({
  handleDropped,
  excelLoadedItems,
  handleDownloadTemplateFile,
}) => {
  // accepted files for react-dropzone in MIME Type
  const accept = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  // handle on file drop with dropzone
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (!!fileRejections.length) {
      defaultFailCB('Tệp tin không phù hợp');
    } else {
      handleDropped(acceptedFiles);
    } // eslint-disable-next-line
  }, []);

  // get props
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept,
    onDrop,
  });

  function getBorderColor(props) {
    if (props.isDragAccept) {
      return '#00e676';
    }
    if (props.isDragReject) {
      return '#ff1744';
    }
    if (props.isDragActive) {
      return '#2196f3';
    }
    return '#eeeeee';
  }

  return (
    <>
      <div
        className="dropzone__container"
        style={{
          // expand to full height of parent
          height: (isDragActive || !!excelLoadedItems.length) && '100%',
          // change border color on Drag event
          borderColor: getBorderColor({
            ...getRootProps({
              isDragActive,
              isDragAccept,
              isDragReject,
            }),
          }),
        }}
        // get props for root container
        {...getRootProps()}
      >
        <div>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Thả file vào đây...</p>
          ) : (
            <p>
              Kéo thả tệp excel vào đây <br />
              hoặc nhấn để chọn tệp của bạn!
            </p>
          )}
        </div>
      </div>
      {isDragActive || !!excelLoadedItems.length || (
        <Button
          onClick={handleDownloadTemplateFile}
          style={{ marginBottom: 10 }}
          className="new"
        >
          Tải file excel mẫu
        </Button>
      )}
    </>
  );
};

//#endregion

//#region Tabs Components

export class Tab extends React.Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  onClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  };

  render() {
    const {
      onClick,
      props: { activeTab, label },
    } = this;

    let className = 'tab-list-item';

    if (activeTab === label) {
      className += ' tab-list-active';
    }

    return (
      <li className={className} onClick={onClick}>
        {label}
      </li>
    );
  }
}

export class Tabs extends React.Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: this.props.children[0].props.label,
    };
  }

  onClickTabItem = tab => {
    this.setState({ activeTab: tab });
  };
  render() {
    const {
      onClickTabItem,
      props: { children },
      state: { activeTab },
    } = this;

    return (
      <div className="tabs">
        <ol className="tab-list">
          {children.map(child => {
            const { label } = child.props;

            return (
              <Tab
                activeTab={activeTab}
                key={label}
                label={label}
                onClick={onClickTabItem}
              />
            );
          })}
        </ol>
        <div className="tab-content">
          {children.map(child => {
            if (child.props.label !== activeTab) return undefined;
            return child.props.children;
          })}
        </div>
      </div>
    );
  }
}

//#endregion
