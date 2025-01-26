import React, { useState, useEffect } from 'react';
    import { PlusCircle, Edit2, Trash2, Key, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
    import { DEFAULT_DOCUMENT_CATEGORIES } from '../../../config/defaultDocumentIndexes';
    import type { DocumentCategory, DocumentIndex } from '../../../types/documentCategory';
    import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

    type TabType = 'categories' | 'indexes';

    export default function DocumentCategoryManagement() {
      const [categories, setCategories] = useState<DocumentCategory[]>([]);
      const [editingCategory, setEditingCategory] = useState<string | null>(null);
      const [newCategoryName, setNewCategoryName] = useState('');
      const [availableIndexes, setAvailableIndexes] = useState<DocumentIndex[]>([]);
      const [newIndex, setNewIndex] = useState<Omit<DocumentIndex, 'id'>>({
        indexLabel: '',
        type: 'nschar',
        size: 20,
        description: ''
      });
      const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
      const [activeTab, setActiveTab] = useState<TabType>('categories');

      useEffect(() => {
        setCategories(DEFAULT_DOCUMENT_CATEGORIES);
        setAvailableIndexes(DEFAULT_DOCUMENT_CATEGORIES.flatMap(cat => cat.indexes));
      }, []);

      const handleAddCategory = () => {
        const newCategory: DocumentCategory = {
          name: newCategoryName,
          indexes: []
        };
        setCategories(prev => [...prev, newCategory]);
        setNewCategoryName('');
      };

      const handleEditCategory = (categoryId: string) => {
        setEditingCategory(categoryId);
      };

      const handleSaveCategory = (categoryId: string) => {
        setCategories(prev => prev.map(category => {
          if (category.name === categoryId) {
            return { ...category, name: newCategoryName };
          }
          return category;
        }));
        setEditingCategory(null);
        setNewCategoryName('');
      };

      const handleAddIndex = (categoryName: string) => {
        setCategories(prev => prev.map(category => {
          if (category.name === categoryName) {
            return { ...category, indexes: [...category.indexes, newIndex] };
          }
          return category;
        }));
        setNewIndex({
          indexLabel: '',
          type: 'nschar',
          size: 20,
          description: ''
        });
      };

      const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const draggedIndex = availableIndexes[source.index];
        const targetCategory = categories.find(cat => cat.name === destination.droppableId);
        if (targetCategory && draggedIndex) {
          setCategories(prev => prev.map(cat => {
            if (cat.name === targetCategory.name) {
              return { ...cat, indexes: [...cat.indexes, draggedIndex] };
            }
            return cat;
          }));
        }
      };

      const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => {
          const next = new Set(prev);
          if (next.has(categoryId)) {
            next.delete(categoryId);
          } else {
            next.add(categoryId);
          }
          return next;
        });
      };

      const renderCategory = (category: DocumentCategory, level = 0) => {
        const isExpanded = expandedCategories.has(category.name);
        return (
          <div key={category.name} style={{ marginLeft: level * 20 + 'px' }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  {hasChildren(category) ? (
                    isExpanded ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />
                  ) : <div className="w-3" />}
                </button>
                <span className="flex items-center gap-1">
                  {isExpanded ? (
                    <FolderOpen className="w-3 h-3 text-blue-400" />
                  ) : (
                    <Folder className="w-3 h-3 text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </span>
              </div>
            </div>
            {isExpanded && (
              <div className="ml-4">
                {category.indexes.map((index, i) => (
                  <div key={i} className="flex items-center gap-2 ml-2 border-l border-gray-300 pl-2">
                    <div className="relative">
                      <div className="absolute left-0 top-1/2 h-[1px] w-2 bg-gray-300" style={{transform: 'translateY(-50%)'}} />
                      <Key className="w-3 h-3 text-gray-500 ml-2" />
                    </div>
                    <span className="text-sm text-gray-700">{index.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      };

      const hasChildren = (category: DocumentCategory) => {
        return categories.some(cat => cat.name === category.name && cat.indexes.length > 0);
      };

      return (
        <div className="flex">
          <div className="w-1/3 p-4 border-r border-gray-200">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${activeTab === 'categories' ? 'bg-gray-200' : ''}`}
              >
                <Folder className="w-4 h-4" />
                <span>Categories</span>
              </button>
              <button
                onClick={() => setActiveTab('indexes')}
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${activeTab === 'indexes' ? 'bg-gray-200' : ''}`}
              >
                <Key className="w-4 h-4" />
                <span>Indexes</span>
              </button>
            </nav>
          </div>
          <div className="flex-1 p-4">
            {activeTab === 'categories' ? (
              <div className="flex">
                <div className="w-1/2 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                    <button
                      onClick={handleAddCategory}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Category
                    </button>
                  </div>
                  <div className="space-y-2">
                    {categories.map(category => renderCategory(category))}
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Available Indexes</h3>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="available-indexes">
                      {(provided) => (
                        <select
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="w-full h-64 border border-gray-300 rounded-md p-2 overflow-y-auto text-sm"
                          multiple
                        >
                          {availableIndexes.map((index, i) => (
                            <Draggable key={index.indexLabel} draggableId={index.indexLabel} index={i}>
                              {(provided) => (
                                <option
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  value={index.indexLabel}
                                  className="p-2 hover:bg-gray-200 cursor-move"
                                >
                                  {index.description}
                                </option>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </select>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Indexes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-1 px-2 border-b font-medium text-gray-700">Label Name</th>
                        <th className="py-1 px-2 border-b font-medium text-gray-700">Type</th>
                        <th className="py-1 px-2 border-b font-medium text-gray-700">Size</th>
                        <th className="py-1 px-2 border-b font-medium text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody style={{ display: 'block', maxHeight: '300px', overflowY: 'auto' }}>
                      {availableIndexes.map((index) => (
                        <tr key={index.indexLabel} className="hover:bg-gray-50">
                          <td className="py-1 px-2 border-b text-gray-700">{index.indexLabel}</td>
                          <td className="py-1 px-2 border-b text-gray-700">{index.type}</td>
                          <td className="py-1 px-2 border-b text-gray-700">{index.size}</td>
                          <td className="py-1 px-2 border-b text-gray-700">{index.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newIndex.indexLabel}
                    onChange={(e) => setNewIndex({ ...newIndex, indexLabel: e.target.value })}
                    placeholder="Index label"
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newIndex.type}
                      onChange={(e) => setNewIndex({ ...newIndex, type: e.target.value as 'nschar' | 'char' | 'datetime' })}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                      <option value="nschar">nschar</option>
                      <option value="char">char</option>
                      <option value="datetime">datetime</option>
                    </select>
                    <input
                      type="number"
                      value={newIndex.size}
                      onChange={(e) => setNewIndex({ ...newIndex, size: parseInt(e.target.value) })}
                      placeholder="Size"
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm w-16"
                    />
                  </div>
                  <input
                    type="text"
                    value={newIndex.description}
                    onChange={(e) => setNewIndex({ ...newIndex, description: e.target.value })}
                    placeholder="Description"
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm flex-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleAddIndex('')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Index
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
