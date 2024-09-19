import { Pressable, SafeAreaView, Text, View, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Task } from "@/components/types/Task";
import { styles } from "./styles";
import { Link } from "expo-router";

export default function Index() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };
    fetchTasks();
  }, []);

  const deleteTask = async (taskId: number) => {
    try {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.headTitle}>
        <Text
          style={styles.headSpecialTitle}
        >
          DIPA {" "}
        </Text>
        To Do List
      </Text>
      {/* <ModalCreate onTaskCreated={fetchTasks} /> */}
      <ScrollView>
        <View>
          {loading ?
            <Text>
              Loading your tasks...
            </Text> : (
              <>
                <Text>
                  Your To Do List ({tasks.length} task(s))
                </Text>
                {tasks.length != 0 ?
                  (
                    <View>
                      {tasks.map((task) => (
                        <View key={task.id} style={styles.card}>
                          <View>
                            <Text style={styles.taskTitle}>{task.title}</Text>
                            <Text style={styles.taskDescription}>{task.description}</Text>
                          </View>
                          <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 8,
                          }}>
                            <Link push href={{ pathname: '/update', params: { id: task.id } }}>
                              <Pressable style={{
                                backgroundColor: 'black',
                                padding: 8,
                                borderRadius: 5,
                              }}>
                              <Text style={{color:'white'}}>Edit</Text>
                              </Pressable>
                            </Link>
                            <Pressable
                              style={{
                                backgroundColor: 'red',
                                padding: 8,
                                borderRadius: 5,
                              }}
                              onPress={() => deleteTask(task.id)}
                            >
                              <Text style={{color:'white'}}>Delete</Text>
                            </Pressable>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text>
                      There is no task. Create one!
                    </Text>
                  )}
              </>
            )}
        </View>
        <View>
          <Text>
            Michael Mervin Ruswan
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

