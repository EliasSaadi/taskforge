import React, { createContext, useContext, useState, useCallback } from 'react';
import { taskService } from '@/services/project/taskService';
import type { TacheComplete, TaskStats } from '@/interfaces';

interface TaskContextType {
  tasks: TacheComplete[];
  loading: boolean;
  error: string | null;
  loadTasks: (projectId: number) => Promise<void>;
  createTask: (projectId: number, taskData: Partial<TacheComplete>) => Promise<void>;
  updateTask: (taskId: number, taskData: Partial<TacheComplete>) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  updateTaskStatus: (taskId: number, status: 'à faire' | 'en cours' | 'terminé') => Promise<void>;
  assignUserToTask: (taskId: number, userId: number) => Promise<void>;
  unassignUserFromTask: (taskId: number, userId: number) => Promise<void>;
  getTaskStats: () => TaskStats;
  clearTasks: () => void;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<TacheComplete[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async (projectId: number) => {
    try {
      setLoading(true);
      setError(null);
      const projectTasks = await taskService.getProjectTasks(projectId);
      setTasks(projectTasks);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors du chargement des tâches';
      setError(message);
      console.error('Erreur dans TaskContext:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (projectId: number, taskData: Partial<TacheComplete>) => {
    try {
      setError(null);
      const newTask = await taskService.createTask({ ...taskData, id_projet: projectId });
      setTasks(prev => [...prev, newTask]);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la création de la tâche';
      setError(message);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (taskId: number, taskData: Partial<TacheComplete>) => {
    try {
      setError(null);
      const updatedTask = await taskService.updateTask(taskId, taskData);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la modification de la tâche';
      setError(message);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (taskId: number) => {
    try {
      setError(null);
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la suppression de la tâche';
      setError(message);
      throw err;
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId: number, status: 'à faire' | 'en cours' | 'terminé') => {
    try {
      setError(null);
      const updatedTask = await taskService.updateTaskStatus(taskId, status);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la modification du statut';
      setError(message);
      throw err;
    }
  }, []);

  const assignUserToTask = useCallback(async (taskId: number, userId: number) => {
    try {
      setError(null);
      await taskService.assignUserToTask(taskId, userId);
      // Recharger les tâches pour avoir les données à jour
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await loadTasks(task.id_projet);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de l\'assignation';
      setError(message);
      throw err;
    }
  }, [tasks, loadTasks]);

  const unassignUserFromTask = useCallback(async (taskId: number, userId: number) => {
    try {
      setError(null);
      await taskService.unassignUserFromTask(taskId, userId);
      // Recharger les tâches pour avoir les données à jour
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await loadTasks(task.id_projet);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la désassignation';
      setError(message);
      throw err;
    }
  }, [tasks, loadTasks]);

  const getTaskStats = useCallback((): TaskStats => {
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.statut === 'terminé').length,
      inProgress: tasks.filter(task => task.statut === 'en cours').length,
      todo: tasks.filter(task => task.statut === 'à faire').length
    };
  }, [tasks]);

  const clearTasks = useCallback(() => {
    setTasks([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      loadTasks,
      createTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      assignUserToTask,
      unassignUserFromTask,
      getTaskStats,
      clearTasks,
      clearError
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
