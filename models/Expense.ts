import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IApproval {
  userId: Types.ObjectId;
  approved: boolean;
  date: Date;
}

export interface IExpense extends Document {
  amount: number;
  date: Date;
  description: string;
  category: string;
  createdBy: Types.ObjectId;
  approvals: IApproval[];
  isFullyApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  checkFullyApproved(): boolean;
}

const ApprovalSchema = new Schema<IApproval>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ExpenseSchema = new Schema<IExpense>(
  {
    amount: {
      type: Number,
      required: [true, 'El monto es requerido'],
      min: [0, 'El monto debe ser mayor o igual a 0'],
    },
    date: {
      type: Date,
      required: [true, 'La fecha es requerida'],
      default: Date.now,
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    category: {
      type: String,
      required: [true, 'La categoría es requerida'],
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El creador del gasto es requerido'],
    },
    approvals: [ApprovalSchema],
    isFullyApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Método para verificar si el gasto está completamente aprobado (todos los 4 admins aprobaron)
ExpenseSchema.methods.checkFullyApproved = function() {
  const approvedCount = this.approvals.filter((a: IApproval) => a.approved).length;
  this.isFullyApproved = approvedCount === 4;
  return this.isFullyApproved;
};

// Índice compuesto para mejorar consultas
ExpenseSchema.index({ createdBy: 1, date: -1 });
ExpenseSchema.index({ isFullyApproved: 1, date: -1 });

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
