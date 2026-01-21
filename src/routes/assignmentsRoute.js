import express from 'express';
import { 
    getAssignmentsByUserId, 
    createAssignment, 
    deleteAssignment, 
    updateAssignment, 
    toggleAssignmentCompletion,
} from '../controllers/assignmentsController.js';

const router = express.Router();

// Create a new assignment
router.post('/', createAssignment);

// Delete an assignment by id
router.delete('/:id', deleteAssignment);

// Update an assignment by id
router.put('/:id', updateAssignment);

// Toggle assignment completion status
router.patch('/:id/toggle', toggleAssignmentCompletion);

// Get all assignments for a user
router.get('/:userId', getAssignmentsByUserId);

export default router;