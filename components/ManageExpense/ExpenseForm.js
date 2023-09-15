import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";

import Input from "./Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";

function ExpenseForm({ onCancel, onSubmit, submitButtonLabel, defaultValue }) {
    const [inputs, setInputs] = useState({
        amount: {
            value: defaultValue ? defaultValue.amount.toString() : "",
            isValid: true,
        },
        date: {
            value: defaultValue ? getFormattedDate(defaultValue.date) : "",
            isValid: true,
        },
        description: {
            value: defaultValue ? defaultValue.description : "",
            isValid: true,
        },
    });

    function inputChangedHandler(inputIdentifier, enteredValue) {
        setInputs((curInputs) => {
            return {
                ...curInputs,
                [inputIdentifier]: { value: enteredValue, isValid: true },
            };
        });
    }

    function submitHandler() {
        const expenseData = {
            amount: +inputs.amount.value,
            date: new Date(inputs.date.value),
            description: inputs.description.value,
        };

        const amountIsValid =
            !isNaN(expenseData.amount) && expenseData.amount > 0;
        const dateIsValid = expenseData.date.toString() !== "Invalid Date";
        const descriptionIsValid = expenseData.description.trim().length > 0;

        if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
            setInputs((curInputs) => {
                return {
                    amount: {
                        value: curInputs.amount.value,
                        isValid: amountIsValid,
                    },
                    date: { value: curInputs.date.value, isValid: dateIsValid },
                    description: {
                        value: curInputs.description.value,
                        isValid: descriptionIsValid,
                    },
                };
            });
            return;
        }

        onSubmit(expenseData);
    }

    const formIsInvalid =
        !inputs.amount.isValid ||
        !inputs.date.isValid ||
        !inputs.description.isValid;

    return (
        <View style={styles.form}>
            <Text style={styles.title}>Khoản chi</Text>
            <View style={styles.inputRow}>
                <Input
                    style={styles.rowInput}
                    label="Chi phí"
                    invalid={!inputs.amount.isValid}
                    textInputConfig={{
                        keyboardType: "decimal-pad",
                        onChangeText: inputChangedHandler.bind(this, "amount"),
                        value: inputs.amount.value,
                    }}
                />
                <Input
                    style={styles.rowInput}
                    label="Ngày"
                    invalid={!inputs.date.isValid}
                    textInputConfig={{
                        placeholder: "yyyy-mm-dd",
                        onChangeText: inputChangedHandler.bind(this, "date"),
                        value: inputs.date.value,
                    }}
                />
            </View>
            <Input
                label="Mô tả"
                invalid={!inputs.description.isValid}
                textInputConfig={{
                    multiline: true,
                    onChangeText: inputChangedHandler.bind(this, "description"),
                    value: inputs.description.value,
                }}
            />
            {formIsInvalid && (
                <Text style={styles.errorText}>
                    Invalid input values - please check your entered data!
                </Text>
            )}
            <View style={styles.buttonContainer}>
                <Button style={styles.button} mode="flat" onPress={onCancel}>
                    Huỷ
                </Button>
                <Button style={styles.button} onPress={submitHandler}>
                    {submitButtonLabel}
                </Button>
            </View>
        </View>
    );
}

export default ExpenseForm;

const styles = StyleSheet.create({
    form: {
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginVertical: 24,
        textAlign: "center",
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    rowInput: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        minWidth: 120,
        marginHorizontal: 8,
    },
    errorText: {
        textAlign: "center",
        color: GlobalStyles.colors.error500,
        margin: 8,
    },
});
