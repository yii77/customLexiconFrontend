import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { TextButton } from '../../ui/Button';

import style from './style';

const overlayStyle = {
  top: style.topModalOverlay,
  center: style.centerModalOverlay,
  bottom: style.bottomModalOverlay,
};

const alertBoxStyle = {
  top: style.topAlertBox,
  center: style.centerAlertBox,
  bottom: style.bottomAlertBox,
};

export default function CustomAlert({
  visible,
  title,
  content,
  buttons,
  type,
  onClose,
  alertStyle,
}) {
  return (
    <Modal transparent visible={visible} statusBarTranslucent>
      <TouchableOpacity
        style={overlayStyle[type] ?? style.centerModalOverlay}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
          style={[alertBoxStyle[type] ?? style.centerAlertBox, alertStyle]}
        >
          {/* 标题 */}
          {title &&
            (typeof title === 'string' ? (
              <Text style={style.alertTitle}>{title}</Text>
            ) : (
              title
            ))}

          {/* 内容 */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {typeof content === 'string' ? (
              <Text style={style.alertMessage}>{content}</Text>
            ) : (
              content
            )}
          </ScrollView>

          {/* 按钮 */}
          {buttons?.length > 0 && (
            <View style={style.buttonRow}>
              {buttons.map((btn, index) => (
                <TextButton
                  key={index}
                  title={btn.text}
                  onPress={btn.onPress}
                  buttonStyle={[style.alertButton, btn.alertButtonStyle]}
                  textStyle={[style.alertButtonText, btn.alertButtonTextStyle]}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
