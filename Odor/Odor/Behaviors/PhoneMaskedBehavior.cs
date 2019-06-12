using System;
using System.Collections.Generic;
using System.Text;
using Xamarin.Forms;

namespace Odor.Behaviors
{
    class PhoneMaskedBehavior : Behavior<Entry>
    {
        private string mask = string.Empty;

        public string Mask
        {
            get => mask;
            set
            {
                mask = value;
                SetPositions();
            }
        }

        protected override void OnAttachedTo(Entry entry)
        {
            entry.TextChanged += OnEntryTextChanged;
            base.OnAttachedTo(entry);
        }

        protected override void OnDetachingFrom(Entry entry)
        {
            entry.TextChanged -= OnEntryTextChanged;
            base.OnDetachingFrom(entry);
        }

        IDictionary<int, char> positions;

        void SetPositions()
        {
            if (string.IsNullOrEmpty(Mask))
            {
                positions = null;
                return;
            }
            Dictionary<int, char> list = new Dictionary<int, char>();
            for (int i = 0; i < Mask.Length; i++)
            {
                if (Mask[i] != 'X')
                {
                    list.Add(i, Mask[i]);
                }
                    
            }
            positions = list;
        }

        private void OnEntryTextChanged(object sender, TextChangedEventArgs args)
        {
            Entry entry = sender as Entry;
            string text = entry.Text;
            if (string.IsNullOrWhiteSpace(text) || positions == null)
            {
                return;
            }
            if (text.Length > mask.Length)
            {
                entry.Text = text.Remove(text.Length - 1);
                return;
            }
            foreach (var position in positions)
            {
                if (text.Length >= position.Key + 1)
                {
                    string value = position.Value.ToString();
                    if (text.Substring(position.Key, 1) != value)
                    {
                        text = text.Insert(position.Key, value);
                    }
                }
            }
            if (entry.Text != text)
            {
                entry.Text = text;
            }
        }
    }
}
