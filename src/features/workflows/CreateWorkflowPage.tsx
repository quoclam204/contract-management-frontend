import React, { useState } from 'react';
import { Button, Input, Select, Modal, message } from 'antd';
import { WorkflowApiService, CreateWorkflowDefinitionRequest, CreateWorkflowStepRequest } from '../../api/workflow';

interface WorkflowStepDto {
  name: string;
  type: string;
  maxAmount?: number;
}

export const CreateWorkflowPage: React.FC = () => {
  const [steps, setSteps] = useState<WorkflowStepDto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [stepName, setStepName] = useState('');
  const [stepType, setStepType] = useState<'approval' | 'review' | 'automation'>('approval');
  const [maxAmount, setMaxAmount] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [conditionExpression, setConditionExpression] = useState('');

  const openModal = () => {
    setStepName('');
    setStepType('approval');
    setMaxAmount(undefined);
    setModalVisible(true);
  };
  const handleCancel = () => setModalVisible(false);

  const handleAddStep = () => {
    if (stepName.trim() && stepType) {
      setSteps(prev => [...prev, { name: stepName, type: stepType, maxAmount }]);
      setModalVisible(false);
    } else {
      message.error('Step name and type are required');
    }
  };

  const handleSubmit = async () => {
    if (!workflowName.trim()) {
      message.error('Workflow name is required');
      return;
    }

    if (!conditionExpression.trim()) {
      message.error('Condition expression is required');
      return;
    }

    if (steps.length === 0) {
      message.error('At least one step is required');
      return;
    }

    setLoading(true);
    try {
      // Convert internal step format to API format
      const apiSteps: CreateWorkflowStepRequest[] = steps.map((step, index) => ({
        approverRole: step.name,
        stepOrder: index + 1,
        minimumAmount: step.maxAmount ?? 0,
        isRequired: true
      }));

      const request: CreateWorkflowDefinitionRequest = {
        name: workflowName,
        conditionExpression: conditionExpression,
        steps: apiSteps
      };

      await WorkflowApiService.createWorkflow(request);
      message.success('Workflow created successfully!');

      // Reset form
      setWorkflowName('');
      setConditionExpression('');
      setSteps([]);
    } catch (error: any) {
      console.error('Failed to create workflow:', error);
      message.error(error?.message || 'Failed to create workflow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-workflow-page">
      <h1>Create Workflow</h1>

      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ display: 'inline-block', width: 100 }}>Workflow Name</span>
          <Input
            value={workflowName}
            onChange={e => setWorkflowName(e.target.value)}
            placeholder="Enter workflow name"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <span style={{ display: 'inline-block', width: 100 }}>Condition Expression</span>
          <Input
            value={conditionExpression}
            onChange={e => setConditionExpression(e.target.value)}
            placeholder="Enter condition expression (e.g., 'value >= 0 && value < 1000000')"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="steps-list">
        {steps.length === 0 ? (
          <p style={{ color: '#8c8c8c', fontStyle: 'italic' }}>No steps added yet</p>
        ) : (
          steps.map((step: WorkflowStepDto, index: number) => (
            <div key={index} className="step-item" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 8, marginBottom: 8 }}>
              <strong>{step.name}</strong> - {step.type}
              {step.maxAmount !== undefined && (
                <span style={{ marginLeft: 12 }}>Max: ${step.maxAmount}</span>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={openModal} loading={loading}>
          + Add Step
        </Button>
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          {loading ? 'Creating...' : 'Create Workflow'}
        </Button>
      </div>

      <Modal
        title="Add Step"
        visible={modalVisible}
        onOk={handleAddStep}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ width: 400 }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: 'inline-block', width: 80 }}>Step Name</span>
            <Input
              value={stepName}
              onChange={e => setStepName(e.target.value)}
              placeholder="Enter step name"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: 'inline-block', width: 80 }}>Step Type</span>
            <Select
              value={stepType}
              onChange={value => setStepType(value as any)}
              style={{ width: '100%' }}
              placeholder="Select step type"
            >
              <Select.Option value="approval">Approval</Select.Option>
              <Select.Option value="review">Review</Select.Option>
              <Select.Option value="automation">Automation</Select.Option>
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: 'inline-block', width: 80 }}>Max Amount</span>
            <Input
              type="number"
              value={maxAmount !== undefined ? maxAmount.toString() : ''}
              onChange={e => {
                const val = e.target.value;
                setMaxAmount(val === '' ? undefined : Number(val));
              }}
              placeholder="Optional amount (for approval steps)"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleAddStep}>
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};