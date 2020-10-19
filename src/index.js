import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const source = Platform.select({
  ios: require("./g6.html"),
  android: { uri: "file:///android_asset/g6.html" },
});

class ReactNativeG6 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.webview = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (data !== nextProps.data) {
      this.update(nextProps.data);
    }
  }

  update = (data) => {
    const stringifyData = JSON.stringify(data);
    const updateScript = `chart.changeData(${stringifyData});`;
    this.webview.current.injectJavaScript(updateScript);
  };

  reload = (script) => this.chart.current.injectJavaScript(script);

  onMessage = (event) => {
    const { onMessage } = this.props;
    const { nativeEvent } = event;
    const { data: jsonData } = nativeEvent;
    const data = JSON.parse(jsonData);
    if (onMessage) onMessage(data, event);
  };

  render() {
    const { injectedJavaScript } = this.props;

    return (
      <WebView
        javaScriptEnabled
        ref={this.webview}
        style={styles.webview}
        source={source}
        originWhitelist={["*"]}
        injectedJavaScript={injectedJavaScript}
        onMessage={this.onMessage}
      />
    );
  }
}

ReactNativeG6.defaultProps = {
  injectedJavaScript: () => "",
};

ReactNativeG6.propTypes = {
  injectedJavaScript: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  onMessage: PropTypes.func,
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

export default ReactNativeG6;
