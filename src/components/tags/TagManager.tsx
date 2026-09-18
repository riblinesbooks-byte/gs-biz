import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TagItem } from '../../types';
import {
  Tag as TagIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FolderTree,
} from 'lucide-react';

export const TagManager: React.FC = () => {
  const { tags, addTag, deleteTag } = useApp();

  const [activeCategory, setActiveCategory] = useState<TagItem['category']>('enquiry_source');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('blue');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    addTag({
      name: newTagName.trim(),
      category: activeCategory,
      color: newTagColor,
    });

    setNewTagName('');
  };

  const categoryTags = tags.filter((t) => t.category === activeCategory);

  const colors = [
    { label: 'Blue', value: 'blue', bg: 'bg-blue-100 text-blue-800' },
    { label: 'Purple', value: 'purple', bg: 'bg-purple-100 text-purple-800' },
    { label: 'Emerald', value: 'emerald', bg: 'bg-emerald-100 text-emerald-800' },
    { label: 'Amber', value: 'amber', bg: 'bg-amber-100 text-amber-800' },
    { label: 'Rose', value: 'rose', bg: 'bg-rose-100 text-rose-800' },
    { label: 'Slate', value: 'slate', bg: 'bg-slate-100 text-slate-800' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <TagIcon className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">CRM Taxonomy & Tags</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              Master Configuration
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure system categories for <strong>Enquiry Source</strong>, <strong>Seller Status</strong>, and{' '}
            <strong>Customer Status</strong> to keep data synchronized.
          </p>
        </div>
      </div>

      {/* Category Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveCategory('enquiry_source')}
          className={`px-3 py-1.5 rounded-md transition ${
            activeCategory === 'enquiry_source'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Enquiry Source ({tags.filter((t) => t.category === 'enquiry_source').length})
        </button>

        <button
          onClick={() => setActiveCategory('buyer_status')}
          className={`px-3 py-1.5 rounded-md transition ${
            activeCategory === 'buyer_status'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Seller Status ({tags.filter((t) => t.category === 'buyer_status').length})
        </button>

        <button
          onClick={() => setActiveCategory('customer_status')}
          className={`px-3 py-1.5 rounded-md transition ${
            activeCategory === 'customer_status'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Customer Status ({tags.filter((t) => t.category === 'customer_status').length})
        </button>
      </div>

      {/* Add New Tag Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-emerald-600" />
          Add New Tag in{' '}
          <span className="text-blue-600 capitalize">{activeCategory.replace('_', ' ')}</span>
        </h3>

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 items-end text-xs">
          <div className="flex-1 w-full sm:w-auto">
            <label className="block font-semibold text-slate-700 mb-1">Tag Label Name</label>
            <input
              type="text"
              placeholder="e.g. Times of India or Pre-Approved Loan"
              required
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-300"
            />
          </div>

          <div className="w-full sm:w-48">
            <label className="block font-semibold text-slate-700 mb-1">Badge Color Tone</label>
            <select
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white"
            >
              {colors.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md shadow-xs transition shrink-0"
          >
            Add Tag
          </button>
        </form>
      </div>

      {/* Existing Tags Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Active Tags in <span className="capitalize">{activeCategory.replace('_', ' ')}</span>
        </h3>

        <div className="flex flex-wrap gap-2.5">
          {categoryTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 font-medium hover:bg-slate-100 transition"
            >
              <span>{tag.name}</span>
              <button
                onClick={() => deleteTag(tag.id)}
                className="text-slate-400 hover:text-rose-600 transition"
                title="Delete Tag"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {categoryTags.length === 0 && (
            <div className="text-slate-400 text-xs py-4">No tags created in this category yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};
