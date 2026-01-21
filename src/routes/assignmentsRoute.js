import express from 'express';
import { 
    getAssignmentsByUserId, 
    createAssignment, 
    deleteAssignment, 
    updateAssignment, 
    toggleAssignmentCompletion,
    suggestedFocus,
} from '../controllers/assignmentsController.js';

const router = express.Router();

router.post('/', createAssignment);

router.delete('/:id', deleteAssignment);

router.put('/:id', updateAssignment);

router.patch('/:id/toggle', toggleAssignmentCompletion);

router.get('/:userId', getAssignmentsByUserId);

router.post('/:userId/key-focus', suggestedFocus);

export default router;