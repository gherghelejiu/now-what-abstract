import React, { useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export type DropdownOption<T = string> = {
  label: string;
  value: T;
};

type DropdownLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DropdownProps<T = string> = {
  options: DropdownOption<T>[];
  selectedValue?: T;
  onSelect: (option: DropdownOption<T>) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
};

function Dropdown<T = string>({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select a document',
  containerStyle,
  buttonStyle,
  labelStyle,
  disabled = false,
}: DropdownProps<T>) {
  const [visible, setVisible] = useState(false);
  const [layout, setLayout] = useState<DropdownLayout | null>(null);
  const buttonRef = useRef<View>(null);

  const selectedLabel =
    options.find((o) => o.value._id === selectedValue)?.label ?? placeholder;

  const openDropdown = () => {
    if (disabled || !buttonRef.current) return;
    // measureInWindow gives coordinates relative to the screen, which is
    // exactly what we need since the Modal renders at the window level.
    buttonRef.current.measureInWindow((x, y, width, height) => {
      setLayout({ x, y, width, height });
      setVisible(true);
    });
  };

  const handleSelect = (option: DropdownOption<T>) => {
    onSelect(option);
    setVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Trigger Button */}
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity
          style={[styles.button, buttonStyle, disabled && styles.disabled]}
          onPress={openDropdown}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonLabel, labelStyle, !selectedValue && styles.placeholder]}>
            {selectedLabel}
          </Text>
          <Text style={styles.arrow}>{visible ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      {layout && (
        <Modal
          visible={visible}
          transparent
          animationType="fade"
          onRequestClose={() => setVisible(false)}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setVisible(false)}
          >
            <View
              style={[
                styles.dropdown,
                {
                  position: 'absolute',
                  top: layout.y + layout.height + 40, // 4px gap below the button
                  left: layout.x,
                  width: layout.width,
                },
              ]}
            >
              <FlatList
                data={options}
                keyExtractor={(_, index) => String(index)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      item.value === selectedValue && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        styles.optionLabel,
                        item.value === selectedValue && styles.selectedOptionLabel,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonLabel: {
    fontSize: 15,
    color: '#222',
  },
  placeholder: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: '#555',
  },
  overlay: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: 300,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f0f4ff',
  },
  optionLabel: {
    fontSize: 15,
    color: '#333',
  },
  selectedOptionLabel: {
    color: '#3a6bff',
    fontWeight: '600',
  },
});

export default Dropdown;