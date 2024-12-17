import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import React, { useReducer, useState } from 'react';
import { Checkbox } from 'react-native-paper';

type Task = {
    task: string;
    ID: number;
    completed: boolean;
};

type EStatus = {
    estatus: boolean;
    ID: number;
};

type TaskAction = 
    | { type: 'add'; payload: Task }
    | { type: 'delete'; payload: number }
    | { type: 'toggle'; payload: number }
    | { type: 'edit'; payload: { task: string; ID: number } };

const TodoList = () => {
    const [inputText, setInputText] = useState('');
    const [editText, setEditText] = useState(''); // Separate edit text state
    const [textID, setTextID] = useState(1);
    const [isEditMode, setIsEditMode] = useState<EStatus>({ estatus: false, ID: 0 });

    const initialTasks: Task[] = [];

    const tasksReducer = (tasks: Task[], action: TaskAction): Task[] => {
        switch (action.type) {
            case 'add':
                return [...tasks, action.payload];
    
            case 'delete':
                return tasks.filter((task) => task.ID !== action.payload);
    
            case 'toggle':
                return tasks.map((task) =>
                    task.ID === action.payload ? { ...task, completed: !task.completed } : task
                );
    
            case 'edit':
                return tasks.map((task) =>
                    task.ID === action.payload.ID
                        ? { ...task, task: action.payload.task } 
                        : task
                );
    
            default:
                return tasks;
        }
    };

    const [tasks, dispatchTasks] = useReducer(tasksReducer, initialTasks);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>ToDo List</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type here"
                    placeholderTextColor="#666"
                    value={inputText}
                    onChangeText={(text) => setInputText(text)}
                />
                <Button
                    title="Add task"
                    color="#007AFF"
                    onPress={() => {
                        if (inputText.trim()) {
                            const newTask: Task = { task: inputText, ID: textID, completed: false };
                            dispatchTasks({ type: 'add', payload: newTask });
                            setTextID(textID + 1);
                            setInputText('');
                        }
                    }}
                />
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <View style={styles.taskLeftContent}>
                            <Checkbox
                                status={item.completed ? 'checked' : 'unchecked'}
                                onPress={() => !isEditMode.estatus && dispatchTasks({ type: 'toggle', payload: item.ID })}
                                color="#007AFF"
                                disabled={isEditMode.estatus && isEditMode.ID === item.ID}
                            />
                            {isEditMode.estatus && isEditMode.ID === item.ID ? (
                                <TextInput
                                    style={styles.editInput}
                                    value={editText} // Use editText here
                                    onChangeText={(text) => setEditText(text)}
                                    multiline
                                    autoFocus
                                />
                            ) : (
                                <Text style={item.completed ? styles.completedTaskText : styles.taskText}>
                                    {item.task}
                                </Text>
                            )}
                        </View>
                        <View style={styles.buttonContainer}>
                            {isEditMode.estatus && isEditMode.ID === item.ID ? (
                                <Button
                                    title="✓"
                                    onPress={() => {
                                        if (editText.trim()) {
                                            dispatchTasks({ type: 'edit', payload:  { task: editText, ID: item.ID } }); // Correctly dispatch the updated task
                                            setIsEditMode({ estatus: false, ID: 0 });
                                            setEditText(''); // Clear the edit input field after updating
                                        }
                                    }}
                                    color="#4CAF50"
                                />
                            ) : (
                                <>
                                    <Button
                                        title="❌"
                                        onPress={() => dispatchTasks({ type: 'delete', payload: item.ID })}
                                        color="#007AFF"
                                    />
                                    <View style={styles.buttonSpacer} />
                                    <Button
                                        title="✏️"
                                        onPress={() => {
                                            setIsEditMode({ estatus: true, ID: item.ID });
                                            setEditText(item.task); // Set editText when starting to edit
                                        }}
                                        color="#007AFF"
                                    />
                                </>
                            )}
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    taskItem: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    taskLeftContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
        color: '#333',
    },
    completedTaskText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    editInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 8,
        backgroundColor: '#f8f8f8',
        minHeight: 40,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonSpacer: {
        width: 8,
    },
});

export default TodoList;
